/**
 * MeepiFaceIcon — renders the companion face in a circle (67×67 viewBox),
 * matching the Andrew/Sang/Jordan "face card" style, but driven by the
 * current companion customization saved in localStorage.
 *
 * Key math  ─────────────────────────────────────────────────────────────────
 *   MeepiCharacter face coords (viewBox 0 0 167.115 145.673):
 *     left-eye  cx1 = 70.59,  cy = 109
 *     right-eye cx2 = 97.04,  cy = 109
 *     mouth     mcx = 83.80, mcy = 112
 *     eyebrows              cy = 100
 *
 *   Target in circle (viewBox 0 0 67 67), matching friend-card faces:
 *     left-eye  ≈ (16.29, 33.0)
 *     right-eye ≈ (50.67, 33.0)
 *     mouth     ≈ (33.46, 36.89)
 *     eyebrows  ≈ same x,   y ≈ 21.29
 *
 *   Solved transform: matrix(1.3, 0, 0, 1.3, -75.48, -108.71)
 *     x_circle = 1.3 * x_char - 75.48
 *     y_circle = 1.3 * y_char - 108.71
 *
 * IMPORTANT: the clipPath and the face transform are applied on SEPARATE
 * nested <g> elements.  If you put clipPath="…" on the same <g> that has
 * the matrix transform, SVG resolves the clip geometry in the group's LOCAL
 * (character) coordinate space, which puts the clip circle far outside the
 * face area and clips everything away.
 */

import { useEffect, useState } from "react";
import eyesSvg    from "../screens/customization/repo-svg/eyesSvg";
import mouthSvg   from "../screens/customization/repo-svg/mouthSvg";
import eyebrowSvg from "../screens/customization/repo-svg/eyebrowSvg";

// ── types ────────────────────────────────────────────────────────────────────
type State = { eyes: number; mouth: number; eyebrow: number; decoration: number; color: number };

const STORAGE_KEY = "meepiCustomization.v1";
const COLOR_SWATCHES = [
  "#3a4175","#d7bace","#eca2c0","#e585ab","#d3716e",
  "#c4210c","#d3762b","#aa9542","#eed167","#dfe596",
  "#769875","#0d8991","#84bfea","#416fa3",
] as const;

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const p = JSON.parse(raw) as Partial<State>;
    return { eyes: p.eyes ?? 0, mouth: p.mouth ?? 0, eyebrow: p.eyebrow ?? 0, decoration: p.decoration ?? 0, color: p.color ?? 12 };
  } catch {
    return { eyes: 0, mouth: 0, eyebrow: 0, decoration: 0, color: 12 };
  }
}

// ── face SVG ─────────────────────────────────────────────────────────────────
function FaceSvg({ state, size }: { state: State; size: number }) {
  const bodyColor = COLOR_SWATCHES[state.color] ?? "#84bfea";

  /* ── eye data ── */
  const cx1 = 70.59, cx2 = 97.04, ey = 109;
  type EyeProp = { w: number; h: number; vb: string; content: React.ReactNode };
  const EP: Record<number, EyeProp> = {
    0: { w:13,  h:13,  vb:"0 0 76 76",       content:<ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E"/> },
    1: { w:13,  h:13,  vb:"0 0 76 76",       content:<ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#1E1E1E"/> },
    2: { w:5.5, h:5.5, vb:"0 0 31 30",       content:<><ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#1E1E1E"/><ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7"/></> },
    3: { w:6.5, h:6.5, vb:"0 0 42.08 42.75", content:<><path d={eyesSvg.p3d21b680} fill="#1E1E1E"/><path d={eyesSvg.p26fe1500} fill="#1E1E1E"/><path d={eyesSvg.p3e254010} fill="#1E1E1E"/></> },
    4: { w:6.5, h:6,   vb:"0 0 40 36.3",     content:<><ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#1E1E1E"/><path d={eyesSvg.pcde3500} fill="#1E1E1E"/></> },
    5: { w:6.5, h:6.5, vb:"0 0 44.5 43.9",   content:<><ellipse cx="22.25" cy="22.09" rx="22.25" ry="21.79" fill="#1E1E1E"/><ellipse cx="24.97" cy="14.37" rx="14.07" ry="10.44" fill="#FFF7E7" transform="rotate(18.5 24.97 14.37)"/><path d={eyesSvg.p3eb06800} fill="#FFF7E7"/></> },
    6: { w:13,  h:13,  vb:"0 0 76 76",       content:<rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)"/> },
    7: { w:13,  h:13,  vb:"0 0 76 76",       content:<path d={eyesSvg.p25856680} fill="#1E1E1E"/> },
    8: { w:6.5, h:5.5, vb:"0 0 40.3 34.7",   content:<><path d={eyesSvg.p2650ce00} fill="#1E1E1E"/><path d={eyesSvg.p12dcb00} fill="#FFF7E7"/><path d={eyesSvg.p14fec80} fill="#FFF7E7"/><path d={eyesSvg.p27a600} fill="#1E1E1E"/></> },
    9: { w:13,  h:13,  vb:"0 0 76 76",       content:<path d={eyesSvg.pc212a00} fill="#1E1E1E"/> },
  };
  const ep = EP[state.eyes] ?? EP[0]!;

  /* ── mouth data ── */
  const mcx = 83.8, mcy = 112;
  type MouthProp = { w: number; h: number; vb: string; content: React.ReactNode };
  const MP: Record<number, MouthProp> = {
    0: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<path d={mouthSvg.pce9f4f0} fill="#1E1E1E"/> },
    1: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<path d={mouthSvg.p2d742180} fill="#1E1E1E"/> },
    2: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<><path d={mouthSvg.p1dc24e40} fill="#1E1E1E"/><path d={mouthSvg.p204b6880} fill="#1E1E1E"/><path d={mouthSvg.p1a122c00} fill="#1E1E1E"/></> },
    3: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<path d={mouthSvg.p888ba80} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="8"/> },
    4: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<path d={mouthSvg.p1fd5f00} fill="#1E1E1E"/> },
    5: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<path d={mouthSvg.p2bdeb700} fill="#1E1E1E"/> },
    6: { w:24, h:24,  vb:"0 0 76.28 76.28", content:<><path d={mouthSvg.p186cdc00} fill="#1E1E1E"/><path d={mouthSvg.p2e520780} fill="#1E1E1E"/></> },
    7: { w:12, h:3.7, vb:"0 0 53.13 16.44", content:<><path d={mouthSvg.p39e67a00} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5"/><path d={mouthSvg.p3dffa900} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5"/></> },
    8: { w:8,  h:9.1, vb:"0 0 17.25 19.66", content:<><ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#1E1E1E"/><path d={mouthSvg.p8d926e0} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3"/></> },
    9: { w:12, h:7,   vb:"0 0 47.09 27.6",  content:<><path d={mouthSvg.p2caf6480} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5"/><path d={mouthSvg.p13245200} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3"/></> },
  };
  const mp = MP[state.mouth] ?? MP[0]!;

  /* ── eyebrow data ── */
  const eby = 100;
  type EbProp = { w: number; h: number; vb: string; content: React.ReactNode };
  const EBP: Record<number, EbProp> = {
    1: { w:24, h:24, vb:"0 0 76 76",       content:<rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)"/> },
    2: { w:24, h:24, vb:"0 0 76.28 76.28", content:<path d={eyebrowSvg.p25856680} fill="#1E1E1E"/> },
    3: { w:24, h:24, vb:"0 0 76.28 76.28", content:<path d={eyebrowSvg.pc212a00} fill="#1E1E1E"/> },
  };
  const ebp = EBP[state.eyebrow];


  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 67 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/*
          clipPath is in the OUTER svg coordinate space (0 0 67 67).
          We apply it to a wrapper <g> that has NO transform, so SVG
          resolves the clip geometry in circle space — not character space.
        */}
        <clipPath id="mfClip">
          <circle cx="33.5" cy="33.5" r="33.5" />
        </clipPath>
      </defs>

      {/* ① circle background */}
      <circle cx="33.5" cy="33.5" r="33.5" fill={bodyColor} />

      {/*
        ② outer <g> carries the clipPath (circle space).
           inner <g> carries the face transform (character → circle space).
           Keeping them separate is essential: clipPath is always resolved
           in the coordinate system of the element that references it,
           BEFORE any transform on that same element takes effect.
      */}
      <g clipPath="url(#mfClip)">
        <g transform="matrix(1.3,0,0,1.3,-75.48,-108.71)">

          {/* eyebrows */}
          {ebp && (
            <>
              <svg x={cx1 - ebp.w / 2} y={eby - ebp.h / 2} width={ebp.w} height={ebp.h} viewBox={ebp.vb} overflow="visible">
                {ebp.content}
              </svg>
              <svg x={cx2 - ebp.w / 2} y={eby - ebp.h / 2} width={ebp.w} height={ebp.h} viewBox={ebp.vb} overflow="visible">
                <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>{ebp.content}</g>
              </svg>
            </>
          )}

          {/* eyes */}
          <svg x={cx1 - ep.w / 2} y={ey - ep.h / 2} width={ep.w} height={ep.h} viewBox={ep.vb} overflow="visible">
            {ep.content}
          </svg>
          <svg x={cx2 - ep.w / 2} y={ey - ep.h / 2} width={ep.w} height={ep.h} viewBox={ep.vb} overflow="visible">
            <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>{ep.content}</g>
          </svg>

          {/* mouth */}
          <svg x={mcx - mp.w / 2} y={mcy - mp.h / 2} width={mp.w} height={mp.h} viewBox={mp.vb} overflow="visible">
            {mp.content}
          </svg>

        </g>
      </g>
    </svg>
  );
}

// ── exported component ────────────────────────────────────────────────────────
export function MeepiFaceIcon({ size = 67, className }: { size?: number; className?: string }) {
  const [state, setState] = useState<State>(() => loadState());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(loadState());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setState(loadState()), 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={className}
      style={{ display: "inline-block", lineHeight: 0, width: size, height: size, flexShrink: 0 }}
    >
      <FaceSvg state={state} size={size} />
    </span>
  );
}
