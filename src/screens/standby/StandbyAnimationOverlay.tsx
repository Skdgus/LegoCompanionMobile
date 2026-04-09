import { useEffect, useState } from "react";
import rotateScreenIcon from "../../../assets/rotate-screen-icon.svg";

const CUST_KEY = "meepiCustomization.v1";
const COLOR_SWATCHES: readonly string[] = [
  "#3a4175", "#d7bace", "#eca2c0", "#e585ab", "#d3716e", "#c4210c",
  "#d3762b", "#aa9542", "#eed167", "#dfe596", "#769875", "#0d8991",
  "#84bfea", "#416fa3",
];

function lightenHex(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 0xff) + amt);
  const b = Math.min(255, (n & 0xff) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function loadBodyColor(): string {
  try {
    const p = JSON.parse(localStorage.getItem(CUST_KEY) ?? "") as { color?: number };
    return (COLOR_SWATCHES[p.color ?? 12] ?? "#84bfea") as string;
  } catch {
    return "#84bfea";
  }
}

/**
 * Three-frame intro animation — each step holds for FRAME_MS.
 *
 *  step 0  — Phone centred on screen (portrait)      Figma 592:1840
 *  step 1  — Shift left + text reveal                 Figma 875:516
 *  step 2  — Canvas expands to landscape              Figma 875:527
 *             phone centres in 874×402, no rotation
 *
 *  Total duration ≈ FRAME_MS × 3  ≈ 3.6 s
 */

const FRAME_MS = 1200;
const TRANS_MS = 1000;
const EASE = `${TRANS_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;

const PHONE_W = 251;
const PHONE_H = 250;

type Props = {
  onComplete: () => void;
};

export function StandbyAnimationOverlay({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const bodyColor = loadBodyColor();
  const screenBg = lightenHex(bodyColor, 10);

  // Track viewport height so the phone is always visually centred on screen
  // in the portrait steps, regardless of device/browser chrome height.
  const [vH, setVH] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => setVH(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (step >= 3) {
      const t = window.setTimeout(onComplete, FRAME_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), FRAME_MS);
    return () => window.clearTimeout(t);
  }, [step, onComplete]);

  // ── Canvas dims ────────────────────────────────────────────────────────────
  // Portrait canvas fills the viewport; landscape canvas is 874×402.
  const landscape = step >= 2;
  const canvasW   = landscape ? 874 : 402;
  const canvasH   = landscape ? 402 : vH;   // fill screen height in portrait

  // ── Phone position ─────────────────────────────────────────────────────────
  // Portrait: horizontally centred in 402px; vertically centred in viewport.
  // Landscape: centred in 874×402.
  const phoneTopPortrait  = Math.round(vH / 2 - PHONE_H / 2);
  const phoneLeft = step === 0 ? Math.round((402 - PHONE_W) / 2)  // centred
                  : step === 1 ? 0                                  // shift left
                  : Math.round((874 - PHONE_W) / 2);               // landscape centre (312)
  const phoneTop  = step <= 1 ? phoneTopPortrait
                              : Math.round((402 - PHONE_H) / 2);   // 76

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="presentation"
      style={{
        boxSizing: "border-box",
        paddingTop: "calc(44px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(34px + env(safe-area-inset-bottom, 0px))",
        backgroundColor: screenBg,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: canvasW,
          height: canvasH,
          maxWidth: "100vw",
          maxHeight:
            "calc(100dvh - 44px - 34px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
          transition: `width ${EASE}, height ${EASE}`,
          backgroundColor: screenBg,
        }}
      >
        {/* Combined phone + rotate icon */}
        <div
          className="absolute"
          style={{
            left: phoneLeft,
            top: phoneTop,
            width: PHONE_W,
            height: PHONE_H,
            transition: `left ${EASE}, top ${EASE}`,
          }}
        >
          <img src={rotateScreenIcon} alt="" width={PHONE_W} height={PHONE_H} draggable={false} />
        </div>

        {/* "Rotate your Phone" text — aligns vertically with phone, fades in at step 1 */}
        <div
          className="pointer-events-none absolute text-[#1a1a1a]"
          style={{
            left: 226,
            top: phoneTopPortrait,
            width: 153,
            opacity: step === 1 ? 1 : 0,
            transition: `opacity ${EASE}, top ${EASE}`,
          }}
        >
          <p className="text-[15px] font-medium leading-snug">For a better</p>
          <p className="text-[15px] font-medium leading-snug">experience, please</p>
          <p className="pt-1 text-[22px] font-extrabold leading-tight">Rotate</p>
          <p className="text-[15px] font-semibold leading-snug">your Phone</p>
        </div>
      </div>
    </div>
  );
}
