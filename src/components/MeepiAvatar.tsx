import { useEffect, useState } from "react";
import { motion } from "motion/react";
import eyesSvg from "../screens/customization/repo-svg/eyesSvg";
import mouthSvg from "../screens/customization/repo-svg/mouthSvg";
import eyebrowSvg from "../screens/customization/repo-svg/eyebrowSvg";
import mainSvg from "../screens/customization/repo-svg/mainSvg";

export type CustomizationState = {
  eyes: number;
  mouth: number;
  eyebrow: number;
  decoration: number;
  color: number;
};

const STORAGE_KEY = "meepiCustomization.v1";

function loadState(): CustomizationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Partial<CustomizationState>;
    return {
      eyes: parsed.eyes ?? 0,
      mouth: parsed.mouth ?? 0,
      eyebrow: parsed.eyebrow ?? 0,
      decoration: parsed.decoration ?? 0,
      color: parsed.color ?? 0,
    };
  } catch {
    return { eyes: 0, mouth: 0, eyebrow: 0, decoration: 0, color: 0 };
  }
}

const COLOR_SWATCHES = [
  "#3a4175",
  "#d7bace",
  "#eca2c0",
  "#e585ab",
  "#d3716e",
  "#c4210c",
  "#d3762b",
  "#aa9542",
  "#eed167",
  "#dfe596",
  "#769875",
  "#0d8991",
  "#84bfea",
  "#416fa3",
] as const;

export function MeepiCharacter({
  state,
  expressionSrc,
  expressionVisible = false,
}: {
  state: CustomizationState;
  expressionSrc?: string;
  expressionVisible?: boolean;
}) {
  const bodyColor = COLOR_SWATCHES[state.color] ?? "#84BFEA";
  const lighten = (hex: string, amt: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amt));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
    const b = Math.max(0, Math.min(255, (num & 0xff) + amt));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };
  const darken = (hex: string, amt: number) => lighten(hex, -amt);
  const bodyLight = lighten(bodyColor, 30);
  const bodyLighter = lighten(bodyColor, 50);
  const bodyDark = darken(bodyColor, 25);
  const bodyDarker = darken(bodyColor, 40);

  const renderEyes = () => {
    const cx1 = 70.59,
      cx2 = 97.04,
      cy = 109;
    const eyes = state.eyes;
    const props =
      ({
        0: { w: 13, h: 13, vb: "0 0 76 76", content: <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" /> },
        1: { w: 13, h: 13, vb: "0 0 76 76", content: <ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#1E1E1E" /> },
        2: { w: 5.5, h: 5.5, vb: "0 0 31 30", content: <><ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#1E1E1E" /><ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7" /></> },
        3: { w: 6.5, h: 6.5, vb: "0 0 42.08 42.75", content: <><path d={eyesSvg.p3d21b680} fill="#1E1E1E" /><path d={eyesSvg.p26fe1500} fill="#1E1E1E" /><path d={eyesSvg.p3e254010} fill="#1E1E1E" /></> },
        4: { w: 6.5, h: 6, vb: "0 0 40 36.3", content: <><ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#1E1E1E" /><path d={eyesSvg.pcde3500} fill="#1E1E1E" /></> },
        5: { w: 6.5, h: 6.5, vb: "0 0 44.5 43.9", content: <><ellipse cx="22.25" cy="22.09" rx="22.25" ry="21.79" fill="#1E1E1E" /><ellipse cx="24.97" cy="14.37" rx="14.07" ry="10.44" fill="#FFF7E7" transform="rotate(18.5 24.97 14.37)" /><path d={eyesSvg.p3eb06800} fill="#FFF7E7" /></> },
        6: { w: 13, h: 13, vb: "0 0 76 76", content: <rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)" /> },
        7: { w: 13, h: 13, vb: "0 0 76 76", content: <path d={eyesSvg.p25856680} fill="#1E1E1E" /> },
        8: { w: 6.5, h: 5.5, vb: "0 0 40.3 34.7", content: <><path d={eyesSvg.p2650ce00} fill="#1E1E1E" /><path d={eyesSvg.p12dcb00} fill="#FFF7E7" /><path d={eyesSvg.p14fec80} fill="#FFF7E7" /><path d={eyesSvg.p27a600} fill="#1E1E1E" /></> },
        9: { w: 13, h: 13, vb: "0 0 76 76", content: <path d={eyesSvg.pc212a00} fill="#1E1E1E" /> },
      } as const)[eyes] ?? { w: 13, h: 13, vb: "0 0 76 76", content: <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" /> };

    return (
      <>
        <svg x={cx1 - props.w / 2} y={cy - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
          {props.content}
        </svg>
        <svg x={cx2 - props.w / 2} y={cy - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
          <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>{props.content}</g>
        </svg>
      </>
    );
  };

  const renderMouth = () => {
    const mcx = 83.8,
      mcy = 112;
    const mouth = state.mouth;
    const props =
      ({
        0: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.pce9f4f0} fill="#1E1E1E" /> },
        1: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p2d742180} fill="#1E1E1E" /> },
        2: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <><path d={mouthSvg.p1dc24e40} fill="#1E1E1E" /><path d={mouthSvg.p204b6880} fill="#1E1E1E" /><path d={mouthSvg.p1a122c00} fill="#1E1E1E" /></> },
        3: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p888ba80} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="8" /> },
        4: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p1fd5f00} fill="#1E1E1E" /> },
        5: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p2bdeb700} fill="#1E1E1E" /> },
        6: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <><path d={mouthSvg.p186cdc00} fill="#1E1E1E" /><path d={mouthSvg.p2e520780} fill="#1E1E1E" /></> },
        7: { w: 12, h: 3.7, vb: "0 0 53.13 16.44", content: <><path d={mouthSvg.p39e67a00} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /><path d={mouthSvg.p3dffa900} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /></> },
        8: { w: 8, h: 9.1, vb: "0 0 17.25 19.66", content: <><ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#1E1E1E" /><path d={mouthSvg.p8d926e0} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3" /></> },
        9: { w: 12, h: 7, vb: "0 0 47.09 27.6", content: <><path d={mouthSvg.p2caf6480} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="5" /><path d={mouthSvg.p13245200} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="3" /></> },
      } as const)[mouth] ?? { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mainSvg.p3ad85f00} fill="#1E1E1E" /> };

    return (
      <svg x={mcx - props.w / 2} y={mcy - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
        {props.content}
      </svg>
    );
  };

  const renderEyebrows = () => {
    const y = 100;
    const cx1 = 70.59,
      cx2 = 97.04;
    const eyebrow = state.eyebrow;
    const props =
      ({
        1: { w: 24, h: 24, vb: "0 0 76 76", content: <rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)" /> },
        2: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={eyebrowSvg.p25856680} fill="#1E1E1E" /> },
        3: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={eyebrowSvg.pc212a00} fill="#1E1E1E" /> },
      } as const)[eyebrow];
    if (!props) return null;
    return (
      <>
        <svg x={cx1 - props.w / 2} y={y - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
          {props.content}
        </svg>
        <svg x={cx2 - props.w / 2} y={y - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
          <g style={{ transformOrigin: "50% 50%", transform: "scaleX(-1)" }}>{props.content}</g>
        </svg>
      </>
    );
  };

  // Decoration overlay positions (from your *Companion.svg examples)
  const renderDecorationOverlay = () => {
    switch (state.decoration) {
      case 1:
        return (
          <>
            <g opacity="0.8">
              <rect x="103" y="108" width="9" height="9" rx="4.5" fill="#FF8CA3" />
            </g>
            <g opacity="0.8">
              <rect x="57" y="108" width="9" height="9" rx="4.5" fill="#FF8CA3" />
            </g>
          </>
        );
      case 2:
        return (
          <>
            <path d="M68.5 116C74.299 116 79 111.299 79 105.5C79 99.701 74.299 95 68.5 95C62.701 95 58 99.701 58 105.5C58 111.299 62.701 116 68.5 116Z" stroke="#1E1E1E" strokeWidth="2.5" />
            <path d="M100.5 116C106.299 116 111 111.299 111 105.5C111 99.701 106.299 95 100.5 95C94.701 95 90 99.701 90 105.5C90 111.299 94.701 116 100.5 116Z" stroke="#1E1E1E" strokeWidth="2.5" />
            <path d="M80 105L89 105" stroke="#1E1E1E" strokeWidth="2.5" />
          </>
        );
      case 3:
        return (
          <>
            <path d="M74 115.812C74 114.2 75.8101 113.25 77.1367 114.167L81.6491 117.284C82.7915 118.073 82.8019 119.758 81.6693 120.561L77.157 123.761C75.8326 124.7 74 123.753 74 122.13V115.812Z" fill="#FF4B4B" />
            <path d="M95 115.841C95 114.223 93.1786 113.275 91.8531 114.203L87.3407 117.362C86.2032 118.158 86.2032 119.842 87.3407 120.638L91.8531 123.797C93.1786 124.725 95 123.777 95 122.159V115.841Z" fill="#FF4B4B" />
            <path d="M81.7009 119.003C81.3584 118.024 82.0848 117 83.1218 117H85.8782C86.9152 117 87.6416 118.024 87.2991 119.003C87.1864 119.325 87.1864 119.675 87.2991 119.997C87.6416 120.976 86.9152 122 85.8782 122H83.1218C82.0848 122 81.3584 120.976 81.7009 119.997C81.8136 119.675 81.8136 119.325 81.7009 119.003Z" fill="#E62E2E" />
          </>
        );
      case 4:
        return <path d="M54.6291 98C58.8086 105.32 56.5817 107 54.6291 107C52.6765 107 49.8462 105.534 54.6291 98Z" fill="#84BFEA" stroke="#56A5D9" />;
      case 5:
        return (
          <>
            <path d="M115.291 99.3556L107.327 101.489C106.594 101.686 106.159 102.439 106.356 103.172L107.067 105.827C107.263 106.56 108.017 106.995 108.75 106.798L116.713 104.665C117.446 104.468 117.881 103.715 117.685 102.982L116.974 100.327C116.777 99.5942 116.024 99.1592 115.291 99.3556Z" fill="#FFE2C2" stroke="#DCA26E" strokeWidth="0.5" />
            <path d="M113.235 100.973L109.917 101.862C109.367 102.01 109.041 102.575 109.188 103.125L109.544 104.452C109.691 105.002 110.256 105.328 110.806 105.181L114.124 104.292C114.674 104.144 115 103.579 114.853 103.029L114.497 101.702C114.35 101.152 113.785 100.826 113.235 100.973Z" fill="#FFCF9E" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.svg
      viewBox="0 0 167.115 145.673"
      fill="none"
      className="size-full"
      key={`${state.eyes}-${state.mouth}-${state.eyebrow}-${state.color}-${state.decoration}`}
      initial={{ scale: 0.97, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={mainSvg.p32340b00} fill="#007F38" />
      <path d={mainSvg.p2e0a7fc0} fill="#2F443B" />
      <ellipse cx="13.02" cy="5.63" rx="13.02" ry="5.63" fill="#090F0D" transform="matrix(0.986 0.165 0.415 -0.91 87.42 23.96)" />
      <path d={mainSvg.p32a6b280} fill="#2F443B" />
      <path d={mainSvg.p6f99500} fill="#2F443B" />
      <path d={mainSvg.p178f8180} fill="#0A1B15" />
      <path d={mainSvg.p23a82d80} fill="#2F443B" />
      <path d={mainSvg.p2470fa80} fill="#007F38" />
      <path d={mainSvg.p4c70280} fill="#007F38" />
      <path d={mainSvg.p30a4aa80} fill="#3B1E16" />
      <path d={mainSvg.p2eda2b00} fill="#0A1B15" />
      <ellipse cx="17.11" cy="5.66" rx="17.11" ry="5.66" fill="#2F443B" transform="matrix(0.737 -0.676 0.794 0.608 6.95 30.03)" />
      <ellipse cx="16.76" cy="6.75" rx="16.76" ry="6.75" fill="#090F0D" transform="matrix(0.772 0.636 0.729 -0.685 118.76 14.03)" />
      <ellipse cx="13.05" cy="7.44" rx="13.05" ry="7.44" fill="#090F0D" transform="matrix(1 0 0.087 -0.996 58.21 26.77)" />
      <path d={mainSvg.p131cbff0} fill="#2F443B" />
      <ellipse cx="13.54" cy="6.35" rx="13.54" ry="6.35" fill="#090F0D" transform="matrix(1 0 0.098 -0.995 40.16 29.05)" />
      <path d={mainSvg.p1026e2a0} fill="#007F38" />
      <path d={mainSvg.p1aeb90c0} fill="#007F38" />
      <path d={mainSvg.p30479400} fill="#006B34" />
      <path d={mainSvg.p46929c0} fill="#006B34" />
      <path d={mainSvg.p15439f20} fill="#006B34" />
      <path d={mainSvg.p10e3e380} fill="#006B34" />
      <path d={mainSvg.p4284900} fill="#006B34" />
      <path d={mainSvg.pf5a340} fill="#006B34" />
      <path d={mainSvg.p1fb24400} fill="#006B34" />
      <path d={mainSvg.pd69f600} fill="#006B34" />
      <path d={mainSvg.p15079e00} fill="#006B34" />
      <path d={mainSvg.p1f9adb00} fill="#007F38" />
      <path d={mainSvg.pce331c0} fill="#007F38" />
      <path d={mainSvg.p2f406100} fill="#0A1B15" />
      <path d={mainSvg.p1f8bf900} fill="#007F38" />
      <path d={mainSvg.p1c7971b0} fill="#3B1E16" />
      <path d={mainSvg.pe45ea00} fill="#0A1B15" />
      <ellipse cx="14.27" cy="2.73" rx="14.27" ry="2.73" fill="#2F443B" transform="matrix(0.931 0.364 -0.46 0.888 106.57 11.83)" />
      <ellipse cx="17.6" cy="5.83" rx="17.6" ry="5.83" fill="#2F443B" transform="matrix(0.926 -0.378 0.546 0.838 31.79 25.85)" />
      <path d={mainSvg.p1b76b00} fill="#0A1B15" />
      <ellipse cx="14.54" cy="5.66" rx="14.54" ry="5.66" fill="#2F443B" transform="matrix(0.996 0.092 0.081 0.997 78.1 0.04)" />

      <rect fill={bodyColor} height="71.28" rx="1.5" width="112.68" x="27.25" y="68.29" />
      <rect fill={bodyLight} height="27.13" rx="3.5" width="86.12" x="40.47" y="94.62" />

      {/* Expression — lives inside the face plate, behind the body overlay / stud paths */}
      {expressionSrc && (
        <image
          href={expressionSrc}
          x="71.78"
          y="96.44"
          width="23.5"
          height="23.5"
          preserveAspectRatio="xMidYMid meet"
          style={{
            opacity: expressionVisible ? 1 : 0,
            transition: "opacity 0.12s ease-out",
          }}
        />
      )}

      <path d={mainSvg.p1193bf40} fill={bodyDark} />
      <path d={mainSvg.pab4ca00} fill={bodyDark} />
      <circle cx="45.3" cy="130.73" r="14.95" fill={bodyDarker} />
      <circle cx="121.87" cy="130.73" r="14.95" fill={bodyDarker} />
      <path d={mainSvg.p2cf61000} fill={bodyLighter} />
      <path d={mainSvg.p18483500} fill={bodyLighter} />

      {!expressionVisible && renderEyebrows()}
      {!expressionVisible && renderEyes()}
      {!expressionVisible && renderMouth()}
      {!expressionVisible && renderDecorationOverlay()}
    </motion.svg>
  );
}

export function MeepiAvatar({
  width,
  height,
  className,
  expressionSrc,
  expressionVisible,
}: {
  width: number;
  height: number;
  className?: string;
  expressionSrc?: string;
  expressionVisible?: boolean;
}) {
  const [state, setState] = useState<CustomizationState>(() => loadState());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(loadState());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Same-tab updates: localStorage doesn't emit storage events, so we also poll lightly.
  useEffect(() => {
    const id = window.setInterval(() => setState(loadState()), 800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={className} style={{ width, height }}>
      <MeepiCharacter
        state={state}
        expressionSrc={expressionSrc}
        expressionVisible={expressionVisible}
      />
    </div>
  );
}

