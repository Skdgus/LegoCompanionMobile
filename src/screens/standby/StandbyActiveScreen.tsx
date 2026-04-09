import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// ── Expression SVGs ───────────────────────────────────────────────────────────
import exprImg1 from "../../../assets/expression-1.svg";
import exprImg2 from "../../../assets/expression-2.svg";
import exprImg3 from "../../../assets/expression-3.svg";
import exprImg4 from "../../../assets/expression-4.svg";
import exprImg5 from "../../../assets/expression-5.svg";
import exprImg6 from "../../../assets/expression-6.svg";
import exprImg7 from "../../../assets/expression-7.svg";
import exprImg8 from "../../../assets/expression-8.svg";
import exprImg9 from "../../../assets/expression-9.svg";

const EXPR_IMGS = [exprImg1, exprImg2, exprImg3, exprImg4, exprImg5, exprImg6, exprImg7, exprImg8, exprImg9];
import eyesSvg   from "../customization/repo-svg/eyesSvg";
import eyebrowSvg from "../customization/repo-svg/eyebrowSvg";
import mouthSvg   from "../customization/repo-svg/mouthSvg";

// ── Customization ─────────────────────────────────────────────────────────────

const CUST_KEY = "meepiCustomization.v1";

type CustState = {
  eyes: number; mouth: number; eyebrow: number; decoration: number; color: number;
};

const COLOR_SWATCHES: readonly string[] = [
  "#3a4175","#d7bace","#eca2c0","#e585ab","#d3716e","#c4210c",
  "#d3762b","#aa9542","#eed167","#dfe596","#769875","#0d8991",
  "#84bfea","#416fa3",
];

function loadCust(): CustState {
  try {
    const p = JSON.parse(localStorage.getItem(CUST_KEY) ?? "") as Partial<CustState>;
    return {
      eyes:       p.eyes       ?? 0,
      mouth:      p.mouth      ?? 0,
      eyebrow:    p.eyebrow    ?? 0,
      decoration: p.decoration ?? 0,
      color:      p.color      ?? 12,
    };
  } catch {
    return { eyes: 0, mouth: 0, eyebrow: 0, decoration: 0, color: 12 };
  }
}

/** Lighten a hex color by adding `amt` to each RGB channel. */
function lightenHex(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (n >> 16)          + amt);
  const g = Math.min(255, ((n >> 8) & 0xff)  + amt);
  const b = Math.min(255, (n & 0xff)         + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// ── StandbyFace ───────────────────────────────────────────────────────────────
//
// A 471×148 SVG matching companion face.svg that adapts to the user's
// customisation choices (body colour, eye variant, mouth variant).
//
// Reference positions taken directly from companion face.svg:
//   Left eye  cx=164.5  cy=78.5
//   Right eye cx=309.5  cy=78.5
//   Mouth     centred   cx≈237  cy≈88
//

const EYE_SIZE  = 30;  // rendered square size for each eye icon (≈ r14.5 from companion face.svg)
const MOUTH_W   = 60;  // rendered width for mouth icon
const MOUTH_H   = 28;  // rendered height for mouth icon
const L_EYE_X   = 164.5;
const R_EYE_X   = 309.5;
const EYE_Y     = 78.5;
const MOUTH_X   = 237;
const MOUTH_Y   = 88;

type IconSpec = { vb: string; c: React.ReactNode };

function StandbyFace({ cust }: { cust: CustState }) {
  const bodyColor = (COLOR_SWATCHES[cust.color] ?? "#84bfea") as string;
  // Background of the face panel — lighter tint of the body colour
  const faceBg    = lightenHex(bodyColor, 35);

  // ── Eye variants (same content as MeepiAvatar.renderEyes) ──────────────
  const ep: IconSpec = (({
    0: { vb: "0 0 76 76",       c: <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" /> },
    1: { vb: "0 0 76 76",       c: <ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#1E1E1E" /> },
    2: { vb: "0 0 31 30",       c: <><ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#1E1E1E" /><ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7" /></> },
    3: { vb: "0 0 42.08 42.75", c: <><path d={eyesSvg.p3d21b680} fill="#1E1E1E" /><path d={eyesSvg.p26fe1500} fill="#1E1E1E" /><path d={eyesSvg.p3e254010} fill="#1E1E1E" /></> },
    4: { vb: "0 0 40 36.3",     c: <><ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#1E1E1E" /><path d={eyesSvg.pcde3500} fill="#1E1E1E" /></> },
    5: { vb: "0 0 44.5 43.9",   c: <><ellipse cx="22.25" cy="22.09" rx="22.25" ry="21.79" fill="#1E1E1E" /><ellipse cx="24.97" cy="14.37" rx="14.07" ry="10.44" fill="#FFF7E7" transform="rotate(18.5 24.97 14.37)" /><path d={eyesSvg.p3eb06800} fill="#FFF7E7" /></> },
    6: { vb: "0 0 76 76",       c: <rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)" /> },
    7: { vb: "0 0 76 76",       c: <path d={eyesSvg.p25856680} fill="#1E1E1E" /> },
    8: { vb: "0 0 40.3 34.7",   c: <><path d={eyesSvg.p2650ce00} fill="#1E1E1E" /><path d={eyesSvg.p12dcb00} fill="#FFF7E7" /><path d={eyesSvg.p14fec80} fill="#FFF7E7" /><path d={eyesSvg.p27a600} fill="#1E1E1E" /></> },
    9: { vb: "0 0 76 76",       c: <path d={eyesSvg.pc212a00} fill="#1E1E1E" /> },
  } as Record<number, IconSpec>)[cust.eyes]) ?? {
    vb: "0 0 76 76",
    c:  <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" />,
  };

  // ── Mouth variants ──────────────────────────────────────────────────────
  const mp: IconSpec = (({
    0: { vb: "0 0 76.28 76.28", c: <path d={mouthSvg.pce9f4f0} fill="#1E1E1E" /> },
    1: { vb: "0 0 76.28 76.28", c: <path d={mouthSvg.p2d742180} fill="#1E1E1E" /> },
    2: { vb: "0 0 76.28 76.28", c: <><path d={mouthSvg.p1dc24e40} fill="#1E1E1E" /><path d={mouthSvg.p204b6880} fill="#1E1E1E" /><path d={mouthSvg.p1a122c00} fill="#1E1E1E" /></> },
    3: { vb: "0 0 76.28 76.28", c: <path d={mouthSvg.p888ba80} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="8" /> },
    4: { vb: "0 0 76.28 76.28", c: <path d={mouthSvg.p1fd5f00} fill="#1E1E1E" /> },
    5: { vb: "0 0 76.28 76.28", c: <path d={mouthSvg.p2bdeb700} fill="#1E1E1E" /> },
    6: { vb: "0 0 76.28 76.28", c: <><path d={mouthSvg.p186cdc00} fill="#1E1E1E" /><path d={mouthSvg.p2e520780} fill="#1E1E1E" /></> },
    7: { vb: "0 0 53.13 16.44", c: <><path d={mouthSvg.p39e67a00} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /><path d={mouthSvg.p3dffa900} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /></> },
    8: { vb: "0 0 17.25 19.66", c: <><ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#1E1E1E" /><path d={mouthSvg.p8d926e0} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3" /></> },
    9: { vb: "0 0 47.09 27.6",  c: <><path d={mouthSvg.p2caf6480} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /><path d={mouthSvg.p13245200} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3" /></> },
  } as Record<number, IconSpec>)[cust.mouth]) ?? {
    vb: "0 0 76.28 76.28",
    c:  <path d={mouthSvg.pce9f4f0} fill="#1E1E1E" />,
  };

  // ── Eyebrow variants — rendered directly in StandbyFace coords ──────────
  // Proportions derived from MeepiAvatar at 256×241 px:
  //   eye pixel size ≈ 20 px  →  StandbyFace EYE_SIZE=30 px  (scale ×1.507)
  //   eyebrow rendered ≈ 37 px wide  →  StandbyFace ≈ 56 px  (use 55)
  //   vertical gap eye–eyebrow ≈ 15 px  →  StandbyFace ≈ 22 px
  //   ∴ EBROW_Y = EYE_Y − 22 = 78.5 − 22 = 56.5 → 57
  const EBROW_SIZE = 55;
  const EBROW_Y    = 57;

  const ebp: IconSpec | null = (({
    1: { vb: "0 0 76 76",       c: <rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)" /> },
    2: { vb: "0 0 76.28 76.28", c: <path d={eyebrowSvg.p25856680} fill="#1E1E1E" /> },
    3: { vb: "0 0 76.28 76.28", c: <path d={eyebrowSvg.pc212a00}  fill="#1E1E1E" /> },
  } as Record<number, IconSpec>)[cust.eyebrow]) ?? null;

  // ── Decoration scale constants ────────────────────────────────────────
  // The non-uniform transform matrix(SX,0,0,SY,TX,TY) maps avatar→standby:
  //   SX=5.479, SY=3.162, TX=-222.3, TY=-266.7
  // For shapes that must appear CIRCULAR (blush, glasses), we compensate by
  // using ry = rx*(SX/SY)  so that  rx*SX = ry*SY  (equal standby radii).
  const SX = 5.479, SY = 3.162, TX = -222.3, TY = -266.7;
  const RY_RATIO = SX / SY; // ≈1.733

  return (
    // 471×148 face panel
    <svg
      width="471"
      height="148"
      viewBox="0 0 471 148"
      fill="none"
      aria-label="Companion face"
    >
      {/* Background: lightened body colour */}
      <rect width="471" height="148" rx="30" fill={faceBg} />

      {/* Left eye — centered at (164.5, 78.5) */}
      <svg
        x={L_EYE_X - EYE_SIZE / 2}
        y={EYE_Y   - EYE_SIZE / 2}
        width={EYE_SIZE}
        height={EYE_SIZE}
        viewBox={ep.vb}
        overflow="visible"
      >
        {ep.c}
      </svg>

      {/* Right eye — mirrored */}
      <svg
        x={R_EYE_X - EYE_SIZE / 2}
        y={EYE_Y   - EYE_SIZE / 2}
        width={EYE_SIZE}
        height={EYE_SIZE}
        viewBox={ep.vb}
        overflow="visible"
      >
        <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>
          {ep.c}
        </g>
      </svg>

      {/* Mouth */}
      <svg
        x={MOUTH_X - MOUTH_W / 2}
        y={MOUTH_Y - MOUTH_H / 2}
        width={MOUTH_W}
        height={MOUTH_H}
        viewBox={mp.vb}
        overflow="visible"
      >
        {mp.c}
      </svg>

      {/*
        Eyebrows — placed directly in StandbyFace coordinate space
        (same x as the eye they're above, EBROW_Y above the eye centre).
        Using a square viewBox renders the crescent shape without distortion.
      */}
      {ebp && (
        <>
          <svg
            x={L_EYE_X - EBROW_SIZE / 2}
            y={EBROW_Y - EBROW_SIZE / 2}
            width={EBROW_SIZE}
            height={EBROW_SIZE}
            viewBox={ebp.vb}
            overflow="visible"
          >
            {ebp.c}
          </svg>
          <svg
            x={R_EYE_X - EBROW_SIZE / 2}
            y={EBROW_Y - EBROW_SIZE / 2}
            width={EBROW_SIZE}
            height={EBROW_SIZE}
            viewBox={ebp.vb}
            overflow="visible"
          >
            <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>{ebp.c}</g>
          </svg>
        </>
      )}

      {/*
        Decorations — positioned via the avatar→standby non-uniform matrix so
        they land on the correct cheek / brow regions.  Circular shapes use a
        compensated ellipse (ry = rx × RY_RATIO) so they appear round despite
        the non-uniform scale.
      */}
      {cust.decoration > 0 && (
        <g transform={`matrix(${SX},0,0,${SY},${TX},${TY})`}>

          {/* Case 1 — pink blush circles on both cheeks */}
          {cust.decoration === 1 && (
            <>
              <ellipse cx="61.5"  cy="112.5" rx="1.8" ry={1.8 * RY_RATIO} fill="#FF8CA3" opacity="0.8" />
              <ellipse cx="107.5" cy="112.5" rx="1.8" ry={1.8 * RY_RATIO} fill="#FF8CA3" opacity="0.8" />
            </>
          )}

          {/* Case 2 — round glasses + bridge */}
          {cust.decoration === 2 && (
            <>
              <ellipse cx="68.5"  cy="105.5" rx="2.74" ry={2.74 * RY_RATIO} fill="none" stroke="#1E1E1E" strokeWidth="0.5" />
              <ellipse cx="100.5" cy="105.5" rx="2.74" ry={2.74 * RY_RATIO} fill="none" stroke="#1E1E1E" strokeWidth="0.5" />
              <line x1="79" y1="105.5" x2="90" y2="105.5" stroke="#1E1E1E" strokeWidth="0.5" />
            </>
          )}

          {/* Case 3 — bow tie (paths acceptable with non-uniform scale) */}
          {cust.decoration === 3 && (
            <>
              <path d="M74 115.812C74 114.2 75.8101 113.25 77.1367 114.167L81.6491 117.284C82.7915 118.073 82.8019 119.758 81.6693 120.561L77.157 123.761C75.8326 124.7 74 123.753 74 122.13V115.812Z" fill="#FF4B4B" />
              <path d="M95 115.841C95 114.223 93.1786 113.275 91.8531 114.203L87.3407 117.362C86.2032 118.158 86.2032 119.842 87.3407 120.638L91.8531 123.797C93.1786 124.725 95 123.777 95 122.159V115.841Z" fill="#FF4B4B" />
              <path d="M81.7009 119.003C81.3584 118.024 82.0848 117 83.1218 117H85.8782C86.9152 117 87.6416 118.024 87.2991 119.003C87.1864 119.325 87.1864 119.675 87.2991 119.997C87.6416 120.976 86.9152 122 85.8782 122H83.1218C82.0848 122 81.3584 120.976 81.7009 119.997C81.8136 119.675 81.8136 119.325 81.7009 119.003Z" fill="#E62E2E" />
            </>
          )}

          {/* Case 4 — teardrop */}
          {cust.decoration === 4 && (
            <path d="M54.6291 98C58.8086 105.32 56.5817 107 54.6291 107C52.6765 107 49.8462 105.534 54.6291 98Z" fill="#84BFEA" stroke="#56A5D9" />
          )}

          {/* Case 5 — plaster / band-aid */}
          {cust.decoration === 5 && (
            <>
              <path d="M115.291 99.3556L107.327 101.489C106.594 101.686 106.159 102.439 106.356 103.172L107.067 105.827C107.263 106.56 108.017 106.995 108.75 106.798L116.713 104.665C117.446 104.468 117.881 103.715 117.685 102.982L116.974 100.327C116.777 99.5942 116.024 99.1592 115.291 99.3556Z" fill="#FFE2C2" stroke="#DCA26E" strokeWidth="0.5" />
              <path d="M113.235 100.973L109.917 101.862C109.367 102.01 109.041 102.575 109.188 103.125L109.544 104.452C109.691 105.002 110.256 105.328 110.806 105.181L114.124 104.292C114.674 104.144 115 103.579 114.853 103.029L114.497 101.702C114.35 101.152 113.785 100.826 113.235 100.973Z" fill="#FFCF9E" />
            </>
          )}

        </g>
      )}
    </svg>
  );
}

// ── Pomodoro timer ────────────────────────────────────────────────────────────

const INITIAL_SEC = 25 * 60;

function formatMmSs(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// ── Real-time clock ───────────────────────────────────────────────────────────

function useRealTimeClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

  const weekday = now.toLocaleDateString([], { weekday: "short" });   // "Wed"
  const month   = now.toLocaleDateString([], { month: "long" });      // "April"
  const day     = now.getDate();
  const suffix  = day === 1 || day === 21 || day === 31 ? "st"
                : day === 2 || day === 22             ? "nd"
                : day === 3 || day === 23             ? "rd"
                : "th";
  const date = `${weekday} ${month} ${day}${suffix}`;

  return { time, date };
}

// ── Geolocation temperature ───────────────────────────────────────────────────

function useTemperature() {
  const [temp, setTemp] = useState<string | null>(null);
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current) return;
    tried.current = true;
    if (!navigator.geolocation) { setTemp("--°C"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res  = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
          );
          const data = (await res.json()) as { current_weather?: { temperature?: number } };
          const t    = data?.current_weather?.temperature;
          setTemp(t != null ? `${Math.round(t)}°C` : "--°C");
        } catch { setTemp("--°C"); }
      },
      () => setTemp("--°C"),
      { timeout: 5000 },
    );
  }, []);

  return temp ?? "--°C";
}

// ── Play / Pause icons ────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <polygon points="6,3 20,12 6,21" fill="#1a1a1a" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5"  y="3" width="4" height="18" rx="1.5" fill="#1a1a1a" />
      <rect x="15" y="3" width="4" height="18" rx="1.5" fill="#1a1a1a" />
    </svg>
  );
}

// ── Leave button ──────────────────────────────────────────────────────────────

function BackChevron() {
  return (
    <svg width="15" height="8" viewBox="0 0 15 8" fill="none" aria-hidden>
      <path
        d="M14 4H2M2 4L5.5 0.5M2 4L5.5 7.5"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── StandbyActiveScreen ───────────────────────────────────────────────────────
//
// Landscape 874×402 standby screen (Figma 560:1314).
//
// Layout (all pixel values derived from Figma & companion face.svg):
//
//   Canvas: 874×402
//   Margin (symmetric): (874 − 471 − 29 − 132) / 2 = 121 px
//
//   ┌───────────────────────────────────────────────────────────────────────┐
//   │  < Leave (top-left, x=20 y=15)                                       │
//   │                                                                       │
//   │  [121px][──── face 471×148 ────][29px][─timer 132×132─][121px]       │
//   │                                                                       │
//   │  [121px][── time ── date ── temp ── 471px ──────────][121px]  bottom │
//   └───────────────────────────────────────────────────────────────────────┘
//
// The face background and screen background both derive from the user's
// chosen companion body colour.
//

// Content geometry (px) — derived from Figma 560:1314
const FACE_W    = 471;
const FACE_H    = 148;
const GAP       = 29;
const TIMER_D   = 132;   // outer diameter
const TIMER_IN  = 118;   // inner orange circle diameter  (ring = (132−118)/2 = 7 px)
const CANVAS_W  = 874;
const CANVAS_H  = 402;
// The face panel is centred in the canvas; the timer hangs off to the right.
// Figma 560:1314: face left ≈ (874−471)/2 = 201.5
const MARGIN_X  = Math.round((CANVAS_W - FACE_W) / 2); // 202

// Vertical: leave button bottom ≈ 43, bottom info height ≈ 20, gap ≈ 20
const CONTENT_TOP = Math.round((CANVAS_H - FACE_H) / 2) - 10; // ≈ 117

type Props = { onLeave: () => void };

export function StandbyActiveScreen({ onLeave }: Props) {
  const [cust, setCust]          = useState<CustState>(loadCust);
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SEC);
  const [running, setRunning]    = useState(false);

  const { time, date } = useRealTimeClock();
  const temperature    = useTemperature();

  // ── Tap expression ────────────────────────────────────────────────────
  const [exprIdx,     setExprIdx]     = useState(0);
  const [exprKey,     setExprKey]     = useState(0);
  const [exprVisible, setExprVisible] = useState(false);
  const exprTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onFaceTap = useCallback(() => {
    if (exprTimer.current) clearTimeout(exprTimer.current);
    setExprIdx((i) => (i + 1) % EXPR_IMGS.length);
    setExprKey((k) => k + 1);
    setExprVisible(true);
    exprTimer.current = setTimeout(() => setExprVisible(false), 900);
  }, []);

  useEffect(() => () => { if (exprTimer.current) clearTimeout(exprTimer.current); }, []);

  // Sync customization from storage (same-tab + cross-tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CUST_KEY) setCust(loadCust());
    };
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(() => setCust(loadCust()), 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(id);
    };
  }, []);

  // Pomodoro countdown
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function onTimerClick() {
    if (secondsLeft === 0) { setSecondsLeft(INITIAL_SEC); setRunning(true); return; }
    setRunning((r) => !r);
  }

  // Dynamic colours from companion body colour
  const bodyColor  = (COLOR_SWATCHES[cust.color] ?? "#84bfea") as string;
  const screenBg   = lightenHex(bodyColor, 10); // overall screen background

  // Conic gradient progress: elapsed portion in dark navy, remaining in cream
  const elapsedDeg = (1 - secondsLeft / INITIAL_SEC) * 360;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-app-bg">
      <div
        className="relative text-[#1a1a1a]"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          maxWidth: "100vw",
          maxHeight: "100vh",
          backgroundColor: screenBg,
        }}
      >
        {/* ── Leave button (top-left) ────────────────────────────────────── */}
        <button
          type="button"
          onClick={onLeave}
          className="absolute flex items-center gap-1 rounded-full px-3 py-1.5 shadow-sm transition hover:brightness-95 active:scale-[0.98]"
          style={{ left: 20, top: 15, background: "var(--color-standby-leave)", minHeight: 28 }}
        >
          <BackChevron />
          <span className="text-[15px] font-extrabold leading-none">Leave</span>
        </button>

        {/* ── Companion face panel — tappable, expression overlays in-place ── */}
        <button
          type="button"
          aria-label="Tap companion face"
          className="absolute cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none"
          style={{ left: MARGIN_X, top: CONTENT_TOP, width: FACE_W, height: FACE_H }}
          onClick={onFaceTap}
        >
          <StandbyFace cust={cust} />

          {/* Expression overlay — covers the face panel with matching bg */}
          <AnimatePresence>
            {exprVisible && (
              <motion.div
                key={exprKey}
                className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-[30px]"
                style={{ background: lightenHex((COLOR_SWATCHES[cust.color] ?? "#84bfea") as string, 35) }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1    }}
                exit={{    opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                <img
                  src={EXPR_IMGS[exprIdx]}
                  alt=""
                  draggable={false}
                  style={{ maxWidth: 174, width: "80%", height: "auto", maxHeight: "88%", objectFit: "contain" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* ── Pomodoro timer (Group 288) — 132×132, pixel-perfect ─────────
             Figma: outer ellipse 132×131, inner orange 118×118, ring = 7 px
             Centred vertically on face panel.                               */}
        <button
          type="button"
          onClick={onTimerClick}
          className="absolute flex items-center justify-center rounded-full border-0 p-0 outline-none transition active:scale-[0.97]"
          style={{
            left:   MARGIN_X + FACE_W + GAP,
            top:    CONTENT_TOP + (FACE_H - TIMER_D) / 2,
            width:  TIMER_D,
            height: TIMER_D,
          }}
          aria-label={
            running
              ? "Pause timer"
              : secondsLeft === 0
                ? "Restart 25 minute timer"
                : secondsLeft === INITIAL_SEC
                  ? "Start 25 minute timer"
                  : "Resume timer"
          }
        >
          {/* Conic-gradient ring */}
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width:  TIMER_D,
              height: TIMER_D,
              background: `conic-gradient(var(--color-standby-progress) ${elapsedDeg}deg, var(--color-standby-ring) ${elapsedDeg}deg)`,
              padding: (TIMER_D - TIMER_IN) / 2,  // = 7 px
            }}
          >
            {/* Inner orange circle */}
            <div
              className="flex flex-col items-center justify-center gap-[5px] rounded-full border-2 border-white/80"
              style={{
                width:  TIMER_IN,
                height: TIMER_IN,
                background: "var(--color-standby-timer)",
              }}
            >
              <span className="text-[20px] font-extrabold tabular-nums leading-none tracking-tight text-[#1a1a1a]">
                {formatMmSs(secondsLeft)}
              </span>
              {running ? <PauseIcon /> : <PlayIcon />}
            </div>
          </div>
        </button>

        {/* ── Bottom info — centred in canvas, aligned to face centre ──────
             Face is centred at x=437; this row is also centred at x=437.   */}
        <div
          className="absolute flex items-center justify-center gap-[60px] font-extrabold text-[#1a1a1a]"
          style={{ left: 0, right: 0, bottom: 28 }}
        >
          <span className="text-[17px] tabular-nums">{time}</span>
          <span className="text-[17px] tabular-nums">{date}</span>
          <span className="text-[17px]">{temperature}</span>
        </div>

      </div>
    </div>
  );
}
