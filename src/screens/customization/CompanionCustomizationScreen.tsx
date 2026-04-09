import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getCompanionName, loadUnlockedFeatures } from "../OnboardingScreen";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import backIcon from "../../../assets/weui_back-filled.svg";
import clothingIcon from "../../../assets/map_clothing-store.svg";
import eyesSvg from "./repo-svg/eyesSvg";
import mouthSvg from "./repo-svg/mouthSvg";
import eyebrowSvg from "./repo-svg/eyebrowSvg";
import mainSvg from "./repo-svg/mainSvg";
import blushTileSvg from "../../../assets/Blush.svg";
import glassesTileSvg from "../../../assets/Glasses.svg";
import bowTieTileSvg from "../../../assets/BowTie.svg";
import sweatTileSvg from "../../../assets/Sweat.svg";
import bandAidTileSvg from "../../../assets/BandAid.svg";

type Props = {
  onBack: () => void;
};

type TabKey = "eyes" | "mouth" | "eyebrow" | "decoration" | "color";

type CustomizationState = {
  tab: TabKey;
  eyes: number;
  mouth: number;
  eyebrow: number;
  decoration: number;
  color: number;
};

const STORAGE_KEY = "meepiCustomization.v1";
export const SHOP_COSMETICS_KEY = "shopCosmetics.v1";

/** Returns the set of decoration indices unlocked via the shop (0 = none, always free). */
export function getUnlockedDecorations(): Set<number> {
  try {
    const raw = localStorage.getItem(SHOP_COSMETICS_KEY);
    if (!raw) return new Set([0]);
    const arr = JSON.parse(raw) as number[];
    return new Set([0, ...arr]);
  } catch {
    return new Set([0]);
  }
}

export function unlockDecoration(idx: number) {
  const current = getUnlockedDecorations();
  current.add(idx);
  localStorage.setItem(SHOP_COSMETICS_KEY, JSON.stringify([...current].filter((n) => n !== 0)));
}

const PAGE_H = 1023.10205078125;

const CONTAINER_W = 362;

export const TILE = 76.27552032470703;
export const GAP = 12;
const GRID_W = 341.1020812988281;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function loadState(): CustomizationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Partial<CustomizationState>;
    return {
      tab: parsed.tab ?? "eyes",
      eyes: parsed.eyes ?? 0,
      mouth: parsed.mouth ?? 0,
      eyebrow: parsed.eyebrow ?? 0,
      decoration: parsed.decoration ?? 0,
      color: parsed.color ?? 0,
    };
  } catch {
    return { tab: "eyes", eyes: 0, mouth: 0, eyebrow: 0, decoration: 0, color: 0 };
  }
}

function saveState(state: CustomizationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function Toast({ text }: { text: string }) {
  return (
    <div className="fixed left-1/2 top-[18px] z-[90] w-full max-w-[402px] -translate-x-1/2 px-5">
      <div className="rounded-full bg-[#212121] px-4 py-2 text-center text-[15px] font-bold text-white shadow-lg">
        {text}
      </div>
    </div>
  );
}

function TabPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 items-center justify-center rounded-[6px] px-3 text-[15px] font-extrabold leading-[24px] text-[#2a2a2a] ${
        active ? "bg-[#ffb411]" : "bg-[#ffe1a0]"
      }`}
    >
      {label}
    </button>
  );
}

export function TileButton({
  selected,
  locked,
  children,
  onClick,
}: {
  selected: boolean;
  locked: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  const [tooltip, setTooltip] = useState(false);

  const handleClick = () => {
    if (locked) {
      setTooltip(true);
      window.setTimeout(() => setTooltip(false), 1500);
      return;
    }
    onClick?.();
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleClick}
        className={`relative flex items-center justify-center overflow-hidden rounded-[15px] outline outline-[3px] ${
          locked
            ? "cursor-not-allowed bg-[#B3C5DA] outline-[#B3C5DA]"
            : "cursor-pointer bg-[#ffe1a0] outline-[#ffb411]"
        } ${selected && !locked ? "ring-2 ring-black/15" : ""}`}
        style={{ width: TILE, height: TILE }}
        aria-pressed={selected}
        whileTap={!locked ? { scale: 0.95 } : undefined}
        animate={selected && !locked ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.button>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#2A2A2A] px-3 py-1.5 text-[15px] text-white"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Locked — keep leveling up!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EyesIcon({ variant }: { variant: number }) {
  const s = 76;
  switch (variant) {
    case 0:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full" aria-hidden>
          <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#2A2A2A" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full" aria-hidden>
          <ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#2A2A2A" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 31 30" fill="none" className="size-8" aria-hidden>
          <ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#2A2A2A" />
          <ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 42.08 42.75" fill="none" className="size-10" aria-hidden>
          <path d={eyesSvg.p3d21b680} fill="#1F1F1F" />
          <path d={eyesSvg.p26fe1500} fill="#1F1F1F" />
          <path d={eyesSvg.p3e254010} fill="#1F1F1F" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 40 36.3" fill="none" className="size-10" aria-hidden>
          <ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#2A2A2A" />
          <path d={eyesSvg.pcde3500} fill="#2A2A2A" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 44.5 43.9" fill="none" className="size-10" aria-hidden>
          <ellipse cx="22.25" cy="22.09" rx="22.25" ry="21.79" fill="#2A2A2A" />
          <ellipse
            cx="24.97"
            cy="14.37"
            rx="14.07"
            ry="10.44"
            fill="#FFF7E7"
            transform="rotate(18.5 24.97 14.37)"
          />
          <path d={eyesSvg.p3eb06800} fill="#FFF7E7" />
        </svg>
      );
    case 6:
      return (
        <div className="flex size-full items-center justify-center">
          <div className="h-[14.5px] w-[26.3px] rotate-[12.28deg] rounded-[8px] bg-[#2a2a2a]" />
        </div>
      );
    case 7:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full" aria-hidden>
          <path d={eyesSvg.p25856680} fill="#2A2A2A" />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 40.3 34.7" fill="none" className="size-10" aria-hidden>
          <path d={eyesSvg.p2650ce00} fill="#2A2A2A" />
          <path d={eyesSvg.p12dcb00} fill="#FFF7E7" />
          <path d={eyesSvg.p14fec80} fill="#FFF7E7" />
          <path d={eyesSvg.p27a600} fill="#2A2A2A" />
        </svg>
      );
    case 9:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full" aria-hidden>
          <path d={eyesSvg.pc212a00} fill="#2A2A2A" />
        </svg>
      );
    default:
      return null;
  }
}

export function MouthIcon({ variant }: { variant: number }) {
  switch (variant) {
    case 0:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.pce9f4f0} fill="#2A2A2A" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p2d742180} fill="#2A2A2A" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p1dc24e40} fill="#2A2A2A" />
          <path d={mouthSvg.p204b6880} fill="#2A2A2A" />
          <path d={mouthSvg.p1a122c00} fill="#2A2A2A" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p888ba80} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="8" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p1fd5f00} fill="#2A2A2A" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p2bdeb700} fill="#2A2A2A" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full" aria-hidden>
          <path d={mouthSvg.p186cdc00} fill="#2A2A2A" />
          <path d={mouthSvg.p2e520780} fill="#2A2A2A" />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 53.13 16.44" fill="none" className="h-4 w-10" aria-hidden>
          <path d={mouthSvg.p39e67a00} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="5" />
          <path d={mouthSvg.p3dffa900} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="5" />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 17.25 19.66" fill="none" className="size-6" aria-hidden>
          <ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#2A2A2A" />
          <path d={mouthSvg.p8d926e0} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="3" />
        </svg>
      );
    case 9:
      return (
        <svg viewBox="0 0 47.09 27.6" fill="none" className="h-6 w-10" aria-hidden>
          <path d={mouthSvg.p2caf6480} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="5" />
          <path d={mouthSvg.p13245200} stroke="#2A2A2A" strokeLinecap="round" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

export function EyebrowIcon({ variant }: { variant: number }) {
  // Pixel-match to provided Eyebrow screenshot: 4 visible tiles (0..3)
  if (variant === 0) {
    return (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden>
        <circle cx="23" cy="23" r="16" stroke="#9aa1a7" strokeWidth="5" />
        <path d="M14 14 L32 32" stroke="#9aa1a7" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 1) {
    return <span className="h-[14.5px] w-[26.3px] rotate-[12.28deg] rounded-[8px] bg-[#2a2a2a]" />;
  }
  if (variant === 2) {
    return <span className="h-[14.5px] w-[41px] rotate-[2deg] rounded-[8px] bg-[#2a2a2a]" />;
  }
  return <span className="h-[14.5px] w-[49px] -rotate-[6deg] rounded-[8px] bg-[#2a2a2a]" />;
}

export function DecorationIcon({ variant }: { variant: number }) {
  // Decoration tile icons from provided SVGs: Blush, Glasses, BowTie, Sweat, BandAid
  if (variant === 0) {
    return (
      <svg width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden>
        <circle cx="23" cy="23" r="16" stroke="#9aa1a7" strokeWidth="5" />
        <path d="M14 14 L32 32" stroke="#9aa1a7" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 1) {
    return (
      <img
        src={blushTileSvg}
        alt="Blush"
        className="h-[62px] w-[62px] object-contain"
        draggable={false}
      />
    );
  }
  if (variant === 2) {
    return (
      <img
        src={glassesTileSvg}
        alt="Glasses"
        className="h-[62px] w-[62px] object-contain"
        draggable={false}
      />
    );
  }
  if (variant === 3) {
    return (
      <img
        src={bowTieTileSvg}
        alt="Bow tie"
        className="h-[62px] w-[62px] object-contain"
        draggable={false}
      />
    );
  }
  if (variant === 4) {
    return (
      <img
        src={sweatTileSvg}
        alt="Sweat"
        className="h-[62px] w-[62px] object-contain"
        draggable={false}
      />
    );
  }
  return (
    <img
      src={bandAidTileSvg}
      alt="Band aid"
      className="h-[62px] w-[62px] object-contain"
      draggable={false}
    />
  );
}

export function ColorSwatch({ idx, selected, onClick }: { idx: number; selected: boolean; onClick: () => void }) {
  const c = COLOR_SWATCHES[idx] ?? "#84bfea";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[76px] w-[76px] rounded-[15px] border-[3px] border-[#ffb411] ${selected ? "ring-2 ring-black/20" : ""}`}
      style={{ background: c }}
      aria-label={`Color ${idx + 1}`}
      aria-pressed={selected}
    />
  );
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

function MeepiCharacter({
  eyes,
  mouth,
  eyebrow,
  color,
  decoration,
}: {
  eyes: number;
  mouth: number;
  eyebrow: number;
  color: number;
  decoration: number;
}) {
  const bodyColor = COLOR_SWATCHES[color] ?? "#84BFEA";
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
    // Figma tile indices: 0=none, 1=short, 2=medium, 3=long
    const props =
      ({
        1: {
          w: 24,
          h: 24,
          vb: "0 0 76 76",
          content: (
            <rect
              x="24.85"
              y="30.75"
              width="26.3"
              height="14.5"
              rx="7.25"
              fill="#1E1E1E"
              transform="rotate(12.28 38 38)"
            />
          ),
        },
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

  const renderDecoration = () => {
    const cx1 = 70.59,
      cx2 = 97.04,
      cy = 109;
    const mcx = 83.8,
      mcy = 112;
    switch (decoration) {
      case 1:
        return (
          <>
            <ellipse cx={cx1 - 22} cy={cy + 10} rx="10" ry="6" fill="#FF8CA3" opacity="0.8" />
            <ellipse cx={cx2 + 22} cy={cy + 10} rx="10" ry="6" fill="#FF8CA3" opacity="0.8" />
          </>
        );
      case 2:
        return (
          <g stroke="#1A1A1A" strokeWidth="4" fill="none">
            <circle cx={cx1} cy={cy} r="16" />
            <circle cx={cx2} cy={cy} r="16" />
            <path d={`M ${cx1 + 16} ${cy} L ${cx2 - 16} ${cy}`} strokeLinecap="round" />
            <path d={`M ${cx1 - 16} ${cy} L ${cx1 - 26} ${cy - 5}`} strokeLinecap="round" />
            <path d={`M ${cx2 + 16} ${cy} L ${cx2 + 26} ${cy - 5}`} strokeLinecap="round" />
          </g>
        );
      case 3:
        return (
          <g transform={`translate(${mcx}, ${mcy + 22})`}>
            <path d="M -16 -12 L -2 0 L -16 12 Z" fill="#FF4B4B" />
            <path d="M 16 -12 L 2 0 L 16 12 Z" fill="#FF4B4B" />
            <circle cx="0" cy="0" r="5" fill="#E62E2E" />
          </g>
        );
      case 4:
        return (
          <g transform={`translate(${cx1 - 38}, ${cy - 25}) rotate(-15)`}>
            <path d="M10 0 Q18 16 10 24 Q2 16 10 0 Z" fill="#84BFEA" stroke="#56A5D9" strokeWidth="1.5" />
          </g>
        );
      case 5:
        return (
          <g transform={`translate(${cx2 + 8}, ${cy + 2}) rotate(-15)`}>
            <rect x="0" y="0" width="18" height="10" rx="3" fill="#FFE2C2" stroke="#DCA26E" strokeWidth="1" />
            <rect x="5" y="2" width="8" height="6" rx="1.5" fill="#FFCF9E" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <motion.svg
      viewBox="0 0 167.115 145.673"
      fill="none"
      className="h-[146px] w-[168px]"
      key={`${eyes}-${mouth}-${eyebrow}-${color}-${decoration}`}
      initial={{ scale: 0.97, opacity: 0.7 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
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
      <path d={mainSvg.p1193bf40} fill={bodyDark} />
      <path d={mainSvg.pab4ca00} fill={bodyDark} />
      <circle cx="45.3" cy="130.73" r="14.95" fill={bodyDarker} />
      <circle cx="121.87" cy="130.73" r="14.95" fill={bodyDarker} />
      <path d={mainSvg.p2cf61000} fill={bodyLighter} />
      <path d={mainSvg.p18483500} fill={bodyLighter} />

      {renderEyebrows()}
      {renderEyes()}
      {renderMouth()}
      {renderDecoration()}
    </motion.svg>
  );
}

function PreviewAvatar({ state }: { state: CustomizationState }) {
  // Keep Figma slot size (215×146), but render repo-character inside
  return (
    <div className="relative" style={{ width: 215, height: 146 }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <MeepiCharacter
          eyes={state.eyes}
          mouth={state.mouth}
          eyebrow={state.eyebrow}
          color={state.color}
          decoration={0}
        />
      </div>

      {/* Decoration overlay positions copied from the provided *Companion.svg examples (viewBox 0 0 168 146). */}
      {state.decoration !== 0 && (
        <svg
          className="absolute left-1/2 top-1/2 h-[146px] w-[168px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 168 146"
          fill="none"
          aria-hidden
        >
          {state.decoration === 1 ? (
            <>
              <g opacity="0.8">
                <rect x="103" y="108" width="9" height="9" rx="4.5" fill="#FF8CA3" />
              </g>
              <g opacity="0.8">
                <rect x="57" y="108" width="9" height="9" rx="4.5" fill="#FF8CA3" />
              </g>
            </>
          ) : state.decoration === 2 ? (
            <>
              <path d="M68.5 116C74.299 116 79 111.299 79 105.5C79 99.701 74.299 95 68.5 95C62.701 95 58 99.701 58 105.5C58 111.299 62.701 116 68.5 116Z" stroke="#1E1E1E" strokeWidth="2.5" />
              <path d="M100.5 116C106.299 116 111 111.299 111 105.5C111 99.701 106.299 95 100.5 95C94.701 95 90 99.701 90 105.5C90 111.299 94.701 116 100.5 116Z" stroke="#1E1E1E" strokeWidth="2.5" />
              <path d="M80 105L89 105" stroke="#1E1E1E" strokeWidth="2.5" />
            </>
          ) : state.decoration === 3 ? (
            <>
              <path d="M74 115.812C74 114.2 75.8101 113.25 77.1367 114.167L81.6491 117.284C82.7915 118.073 82.8019 119.758 81.6693 120.561L77.157 123.761C75.8326 124.7 74 123.753 74 122.13V115.812Z" fill="#FF4B4B" />
              <path d="M95 115.841C95 114.223 93.1786 113.275 91.8531 114.203L87.3407 117.362C86.2032 118.158 86.2032 119.842 87.3407 120.638L91.8531 123.797C93.1786 124.725 95 123.777 95 122.159V115.841Z" fill="#FF4B4B" />
              <path d="M81.7009 119.003C81.3584 118.024 82.0848 117 83.1218 117H85.8782C86.9152 117 87.6416 118.024 87.2991 119.003C87.1864 119.325 87.1864 119.675 87.2991 119.997C87.6416 120.976 86.9152 122 85.8782 122H83.1218C82.0848 122 81.3584 120.976 81.7009 119.997C81.8136 119.675 81.8136 119.325 81.7009 119.003Z" fill="#E62E2E" />
            </>
          ) : state.decoration === 4 ? (
            <path d="M54.6291 98C58.8086 105.32 56.5817 107 54.6291 107C52.6765 107 49.8462 105.534 54.6291 98Z" fill="#84BFEA" stroke="#56A5D9" />
          ) : (
            <>
              <path d="M115.291 99.3556L107.327 101.489C106.594 101.686 106.159 102.439 106.356 103.172L107.067 105.827C107.263 106.56 108.017 106.995 108.75 106.798L116.713 104.665C117.446 104.468 117.881 103.715 117.685 102.982L116.974 100.327C116.777 99.5942 116.024 99.1592 115.291 99.3556Z" fill="#FFE2C2" stroke="#DCA26E" strokeWidth="0.5" />
              <path d="M113.235 100.973L109.917 101.862C109.367 102.01 109.041 102.575 109.188 103.125L109.544 104.452C109.691 105.002 110.256 105.328 110.806 105.181L114.124 104.292C114.674 104.144 115 103.579 114.853 103.029L114.497 101.702C114.35 101.152 113.785 100.826 113.235 100.973Z" fill="#FFCF9E" />
            </>
          )}
        </svg>
      )}
    </div>
  );
}

export function CompanionCustomizationScreen({ onBack }: Props) {
  const [state, setState] = useState<CustomizationState>(() => loadState());
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const cName = getCompanionName();
  const [unlockedDecorations, setUnlockedDecorations] = useState<Set<number>>(() => getUnlockedDecorations());
  // Computed once per render instead of once per tile in the grid (16→1 localStorage reads)
  const unlockedFeatures = useMemo(() => loadUnlockedFeatures(), [state.tab]);

  // Re-read unlocked decorations every time the tab becomes "decoration"
  useEffect(() => {
    if (state.tab === "decoration") {
      setUnlockedDecorations(getUnlockedDecorations());
    }
  }, [state.tab]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  function setTab(tab: TabKey) {
    setState((s) => ({ ...s, tab }));
    const el = tabScrollRef.current;
    if (!el) return;
    const index = ["eyes", "mouth", "eyebrow", "decoration", "color"].indexOf(tab);
    const target = clamp(index * 80, 0, el.scrollWidth);
    el.scrollTo({ left: target, behavior: "smooth" });
  }

  const selectedIndex =
    state.tab === "eyes"
      ? state.eyes
      : state.tab === "mouth"
        ? state.mouth
        : state.tab === "eyebrow"
          ? state.eyebrow
          : state.tab === "decoration"
            ? state.decoration
            : state.color;

  return (
    <div className="relative mx-auto w-full max-w-[402px] bg-app-bg" style={{ minHeight: PAGE_H }}>
      {toast && <Toast text={toast} />}

      {/* Back pill — Frame 11 (20,64) 74×31 */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-5 top-[64px] flex h-[31px] w-[74px] items-center rounded-full bg-orange-primary shadow-sm"
        aria-label="Back"
      >
        <img
          src={backIcon}
          alt=""
          width={8}
          height={16}
          className="absolute left-[12px] top-[7.5px] block"
          draggable={false}
          aria-hidden
        />
        <span className="absolute left-[25px] top-[4px] text-[14px] font-extrabold leading-[23px] text-[#2a2a2a]">
          Back
        </span>
      </button>

      {/* Title row — Frame 758531047 (20,126) */}
      <div className="absolute left-5 top-[126px] flex items-center gap-[8px]">
        <h1 className="text-[32px] font-extrabold leading-[50px] text-text">Customize {cName}</h1>
        <img
          src={clothingIcon}
          alt=""
          width={30}
          height={30}
          className="shrink-0"
          draggable={false}
          aria-hidden
        />
      </div>

      {/* Main content container — Frame 758531149 (20,207) 362×752 */}
      <div className="absolute left-5 top-[207px]" style={{ width: CONTAINER_W, height: 752.10205078125 }}>
        {/* Preview card — Group 287: rect 336×267 at x=13 */}
        <div className="absolute left-[13px] top-0 h-[267px] w-[336px] rounded-[18px] bg-[#ffe1a0] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
          <div className="absolute left-[81px] top-[61.164px] flex h-[146px] w-[215px] items-center justify-start gap-4">
            <PreviewAvatar state={state} />
            <div className="min-w-0">
              <p className="text-[18px] font-extrabold text-[#2a2a2a]">{cName}</p>
              <p className="mt-1 text-[14px] font-bold text-[#2a2a2a]/80">Lvl. 13</p>
            </div>
          </div>
        </div>

        {/* Tabs — Frame 758531048 (0,282) 362×40; slidable */}
        <div
          ref={tabScrollRef}
          className="absolute left-0 top-[282px] h-10 w-[362px] overflow-x-auto overflow-y-hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Inner width = last tab starts at x=364 and is 66 wide → 430 */} 
          <div className="relative h-10" style={{ width: 430 }}>
            <div className="absolute left-0 top-0" style={{ width: 59 }}>
              <TabPill label="Eyes" active={state.tab === "eyes"} onClick={() => setTab("eyes")} />
            </div>
            <div className="absolute left-[67px] top-0" style={{ width: 73 }}>
              <TabPill label="Mouth" active={state.tab === "mouth"} onClick={() => setTab("mouth")} />
            </div>
            <div className="absolute left-[148px] top-0" style={{ width: 90 }}>
              <TabPill label="Eyebrow" active={state.tab === "eyebrow"} onClick={() => setTab("eyebrow")} />
            </div>
            <div className="absolute left-[246px] top-0" style={{ width: 110 }}>
              <TabPill label="Decoration" active={state.tab === "decoration"} onClick={() => setTab("decoration")} />
            </div>
            <div className="absolute left-[364px] top-0" style={{ width: 66 }}>
              <TabPill label="Color" active={state.tab === "color"} onClick={() => setTab("color")} />
            </div>
          </div>
        </div>

        {/* Options grid — Frame 758531148 at x=10.449 y=337 w=341.102 */}
        <div className="absolute top-[337px]" style={{ left: 10.448959350585938, width: GRID_W, height: GRID_W }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(4, ${TILE}px)`,
                gap: GAP,
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const selected = i === selectedIndex;

                const setSelected = () => {
                  setState((s) => {
                    if (s.tab === "eyes") return { ...s, eyes: i };
                    if (s.tab === "mouth") return { ...s, mouth: i };
                    if (s.tab === "eyebrow") return { ...s, eyebrow: i };
                    if (s.tab === "decoration") return { ...s, decoration: i };
                    return { ...s, color: i };
                  });
                };

                const locked = (() => {
                  if (state.tab === "color") return false;
                  if (state.tab === "decoration") return i > 0 && !unlockedDecorations.has(i) && !unlockedFeatures.decoration.includes(i);
                  const allowed = unlockedFeatures[state.tab as "eyes" | "mouth" | "eyebrow"];
                  return !allowed.includes(i);
                })();

                if (state.tab === "color") {
                  return locked ? (
                    <TileButton key={i} selected={selected} locked={true} onClick={setSelected}>
                      <span className="text-[46px] font-extrabold text-[#2a2a2a]">?</span>
                    </TileButton>
                  ) : (
                    <ColorSwatch key={i} idx={i} selected={selected} onClick={setSelected} />
                  );
                }

                return (
                  <TileButton key={i} selected={selected} locked={locked} onClick={locked ? undefined : setSelected}>
                    {locked ? (
                      state.tab === "decoration" ? (
                        <span className="text-[22px]">🔒</span>
                      ) : (
                        <span className="text-[46px] font-extrabold text-[#2a2a2a]">?</span>
                      )
                    ) : state.tab === "eyes" ? (
                      <EyesIcon variant={i} />
                    ) : state.tab === "mouth" ? (
                      <MouthIcon variant={i} />
                    ) : state.tab === "eyebrow" ? (
                      <EyebrowIcon variant={i} />
                    ) : (
                      <DecorationIcon variant={i} />
                    )}
                  </TileButton>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Save Modification — Frame 758531045 (0,693.102) 362×59 */}
        <button
          type="button"
          onClick={() => {
            saveState(state);
            setToast("successfully saved");
            setShowModal(true);
          }}
          className="absolute left-0 top-[693.102px] flex h-[59px] w-[362px] items-center justify-center rounded-[8px] bg-[#ffc542] text-[18px] font-extrabold text-[#2a2a2a] shadow-[0_1px_0_rgba(0,0,0,0.06)] transition hover:brightness-95 active:scale-[0.995]"
        >
          Save Modification
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[95] bg-[#FFF7E7]/80"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-[96] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white p-8 shadow-xl"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex size-16 items-center justify-center rounded-full bg-green-100"
                >
                  <Check className="size-10 text-green-600" strokeWidth={3} />
                </motion.div>
                <div className="text-center">
                  <h2 className="text-[22px] font-bold text-[#1A1A1A]" style={{ fontFamily: "Cabin, sans-serif" }}>
                    Saved Successfully!
                  </h2>
                  <p className="mt-1 text-[15px] text-gray-500">{cName} has been updated.</p>
                </div>
                <motion.button
                  onClick={() => { setShowModal(false); onBack(); }}
                  className="mt-2 w-full rounded-[8px] bg-[#FFB411] py-2.5"
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-[18px] font-bold text-[#2A2A2A]">Done</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

