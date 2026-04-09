import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import eyesSvg from "./repo-svg/eyesSvg";
import mouthSvg from "./repo-svg/mouthSvg";
import eyebrowSvg from "./repo-svg/eyebrowSvg";
import mainSvg from "./repo-svg/mainSvg";

type TabType = "eyes" | "mouth" | "eyebrow" | "color" | "decoration";

// ——— Eye tile SVGs (from Figma) ———
function EyeTile({ index }: { index: number }) {
  const s = 76;
  switch (index) {
    case 0:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full">
          <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#2A2A2A" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full">
          <ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#2A2A2A" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 31 30" fill="none" className="size-8">
          <ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#2A2A2A" />
          <ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 42.08 42.75" fill="none" className="size-10">
          <path d={eyesSvg.p3d21b680} fill="#1F1F1F" />
          <path d={eyesSvg.p26fe1500} fill="#1F1F1F" />
          <path d={eyesSvg.p3e254010} fill="#1F1F1F" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 40 36.3" fill="none" className="size-10">
          <ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#2A2A2A" />
          <path d={eyesSvg.pcde3500} fill="#2A2A2A" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 44.5 43.9" fill="none" className="size-10">
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
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full">
          <path d={eyesSvg.p25856680} fill="#2A2A2A" />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 40.3 34.7" fill="none" className="size-10">
          <path d={eyesSvg.p2650ce00} fill="#2A2A2A" />
          <path d={eyesSvg.p12dcb00} fill="#FFF7E7" />
          <path d={eyesSvg.p14fec80} fill="#FFF7E7" />
          <path d={eyesSvg.p27a600} fill="#2A2A2A" />
        </svg>
      );
    case 9:
      return (
        <svg viewBox={`0 0 ${s} ${s}`} fill="none" className="size-full">
          <path d={eyesSvg.pc212a00} fill="#2A2A2A" />
        </svg>
      );
    default:
      return null;
  }
}

// ——— Mouth tile SVGs ———
function MouthTile({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.pce9f4f0} fill="#2A2A2A" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.p2d742180} fill="#2A2A2A" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.p1dc24e40} fill="#2A2A2A" />
          <path d={mouthSvg.p204b6880} fill="#2A2A2A" />
          <path d={mouthSvg.p1a122c00} fill="#2A2A2A" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path
            d={mouthSvg.p888ba80}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.p1fd5f00} fill="#2A2A2A" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.p2bdeb700} fill="#2A2A2A" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={mouthSvg.p186cdc00} fill="#2A2A2A" />
          <path d={mouthSvg.p2e520780} fill="#2A2A2A" />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 53.13 16.44" fill="none" className="h-4 w-10">
          <path
            d={mouthSvg.p39e67a00}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d={mouthSvg.p3dffa900}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="5"
          />
        </svg>
      );
    case 8:
      return (
        <svg viewBox="0 0 17.25 19.66" fill="none" className="size-6">
          <ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#2A2A2A" />
          <path
            d={mouthSvg.p8d926e0}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      );
    case 9:
      return (
        <svg viewBox="0 0 47.09 27.6" fill="none" className="h-6 w-10">
          <path
            d={mouthSvg.p2caf6480}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <path
            d={mouthSvg.p13245200}
            stroke="#2A2A2A"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      );
    default:
      return null;
  }
}

// ——— Eyebrow tile SVGs ———
function EyebrowTile({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="flex size-full items-center justify-center">
          <div className="h-[14.5px] w-[26.3px] rotate-[12.28deg] rounded-[8px] bg-[#2a2a2a]" />
        </div>
      );
    case 1:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={eyebrowSvg.p25856680} fill="#2A2A2A" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 76.28 76.28" fill="none" className="size-full">
          <path d={eyebrowSvg.pc212a00} fill="#2A2A2A" />
        </svg>
      );
    case 3:
      return (
        <div className="flex size-full items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="2"
            className="size-8 opacity-40"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

// ——— Decoration tile SVGs ———
function DecorationTile({ index }: { index: number }) {
  switch (index) {
    case 0:
      return (
        <div className="flex size-full items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2A2A2A"
            strokeWidth="2"
            className="size-8 opacity-40"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
        </div>
      );
    case 1:
      return (
        <div className="flex size-full items-center justify-center gap-[6px]">
          <div
            className="h-[14px] w-5 bg-[#FF8CA3] opacity-80"
            style={{ borderRadius: "50%" }}
          />
          <div
            className="h-[14px] w-5 bg-[#FF8CA3] opacity-80"
            style={{ borderRadius: "50%" }}
          />
        </div>
      );
    case 2:
      return (
        <div className="flex size-full items-center justify-center">
          <svg
            viewBox="0 0 40 20"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="2.5"
            className="size-10"
          >
            <circle cx="10" cy="10" r="8" />
            <circle cx="30" cy="10" r="8" />
            <line x1="18" y1="10" x2="22" y2="10" />
          </svg>
        </div>
      );
    case 3:
      return (
        <div className="flex size-full items-center justify-center">
          <svg viewBox="0 0 30 20" fill="#FF4B4B" className="size-8">
            <path d="M0 0 L12 10 L0 20 Z" />
            <path d="M30 0 L18 10 L30 20 Z" />
            <circle cx="15" cy="10" r="4" fill="#E62E2E" />
          </svg>
        </div>
      );
    case 4:
      return (
        <div className="flex size-full items-center justify-center">
          <svg viewBox="0 0 20 24" fill="#84BFEA" className="size-6">
            <path
              d="M10 0 Q18 16 10 24 Q2 16 10 0 Z"
              stroke="#56A5D9"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      );
    case 5:
      return (
        <div className="flex size-full items-center justify-center">
          <svg viewBox="0 0 20 20" className="size-8" transform="rotate(-15)">
            <rect
              x="2"
              y="6"
              width="16"
              height="8"
              rx="2"
              fill="#FFE2C2"
              stroke="#DCA26E"
              strokeWidth="1"
            />
            <rect x="6" y="7.5" width="8" height="5" rx="1.5" fill="#FFCF9E" />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

const colorSwatches = [
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
];

const eyeCount = 10;
const mouthCount = 10;
const eyebrowCount = 4;
const colorCount = colorSwatches.length;
const decorationCount = 6;

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
  const bodyColor = colorSwatches[color] || "#84BFEA";
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
        0: {
          w: 13,
          h: 13,
          vb: "0 0 76 76",
          content: (
            <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" />
          ),
        },
        1: {
          w: 13,
          h: 13,
          vb: "0 0 76 76",
          content: (
            <ellipse cx="38.59" cy="38.14" rx="22.25" ry="21.79" fill="#1E1E1E" />
          ),
        },
        2: {
          w: 5.5,
          h: 5.5,
          vb: "0 0 31 30",
          content: (
            <>
              <ellipse cx="15.44" cy="14.98" rx="15.44" ry="14.98" fill="#1E1E1E" />
              <ellipse cx="15.44" cy="14.98" rx="9.08" ry="8.63" fill="#FFF7E7" />
            </>
          ),
        },
        3: {
          w: 6.5,
          h: 6.5,
          vb: "0 0 42.08 42.75",
          content: (
            <>
              <path d={eyesSvg.p3d21b680} fill="#1E1E1E" />
              <path d={eyesSvg.p26fe1500} fill="#1E1E1E" />
              <path d={eyesSvg.p3e254010} fill="#1E1E1E" />
            </>
          ),
        },
        4: {
          w: 6.5,
          h: 6,
          vb: "0 0 40 36.3",
          content: (
            <>
              <ellipse cx="19.98" cy="21.34" rx="15.44" ry="14.98" fill="#1E1E1E" />
              <path d={eyesSvg.pcde3500} fill="#1E1E1E" />
            </>
          ),
        },
        5: {
          w: 6.5,
          h: 6.5,
          vb: "0 0 44.5 43.9",
          content: (
            <>
              <ellipse cx="22.25" cy="22.09" rx="22.25" ry="21.79" fill="#1E1E1E" />
              <ellipse
                cx="24.97"
                cy="14.37"
                rx="14.07"
                ry="10.44"
                fill="#FFF7E7"
                transform="rotate(18.5 24.97 14.37)"
              />
              <path d={eyesSvg.p3eb06800} fill="#FFF7E7" />
            </>
          ),
        },
        6: {
          w: 13,
          h: 13,
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
        7: { w: 13, h: 13, vb: "0 0 76 76", content: <path d={eyesSvg.p25856680} fill="#1E1E1E" /> },
        8: {
          w: 6.5,
          h: 5.5,
          vb: "0 0 40.3 34.7",
          content: (
            <>
              <path d={eyesSvg.p2650ce00} fill="#1E1E1E" />
              <path d={eyesSvg.p12dcb00} fill="#FFF7E7" />
              <path d={eyesSvg.p14fec80} fill="#FFF7E7" />
              <path d={eyesSvg.p27a600} fill="#1E1E1E" />
            </>
          ),
        },
        9: { w: 13, h: 13, vb: "0 0 76 76", content: <path d={eyesSvg.pc212a00} fill="#1E1E1E" /> },
      } as const)[eyes] ?? {
        w: 13,
        h: 13,
        vb: "0 0 76 76",
        content: <ellipse cx="38.14" cy="38.59" rx="15.44" ry="14.98" fill="#1E1E1E" />,
      };

    return (
      <>
        <svg
          x={cx1 - props.w / 2}
          y={cy - props.h / 2}
          width={props.w}
          height={props.h}
          viewBox={props.vb}
          overflow="visible"
        >
          <g style={{ transformOrigin: "50% 50%", transform: "none" }}>{props.content}</g>
        </svg>
        <svg
          x={cx2 - props.w / 2}
          y={cy - props.h / 2}
          width={props.w}
          height={props.h}
          viewBox={props.vb}
          overflow="visible"
        >
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
        2: {
          w: 24,
          h: 24,
          vb: "0 0 76.28 76.28",
          content: (
            <>
              <path d={mouthSvg.p1dc24e40} fill="#1E1E1E" />
              <path d={mouthSvg.p204b6880} fill="#1E1E1E" />
              <path d={mouthSvg.p1a122c00} fill="#1E1E1E" />
            </>
          ),
        },
        3: {
          w: 24,
          h: 24,
          vb: "0 0 76.28 76.28",
          content: (
            <path d={mouthSvg.p888ba80} stroke="#1E1E1E" strokeLinecap="round" strokeWidth="8" />
          ),
        },
        4: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p1fd5f00} fill="#1E1E1E" /> },
        5: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={mouthSvg.p2bdeb700} fill="#1E1E1E" /> },
        6: {
          w: 24,
          h: 24,
          vb: "0 0 76.28 76.28",
          content: (
            <>
              <path d={mouthSvg.p186cdc00} fill="#1E1E1E" />
              <path d={mouthSvg.p2e520780} fill="#1E1E1E" />
            </>
          ),
        },
        7: {
          w: 12,
          h: 3.7,
          vb: "0 0 53.13 16.44",
          content: (
            <>
              <path
                d={mouthSvg.p39e67a00}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <path
                d={mouthSvg.p3dffa900}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeWidth="5"
              />
            </>
          ),
        },
        8: {
          w: 8,
          h: 9.1,
          vb: "0 0 17.25 19.66",
          content: (
            <>
              <ellipse cx="8.63" cy="7.72" rx="8.63" ry="7.72" fill="#1E1E1E" />
              <path
                d={mouthSvg.p8d926e0}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </>
          ),
        },
        9: {
          w: 12,
          h: 7,
          vb: "0 0 47.09 27.6",
          content: (
            <>
              <path
                d={mouthSvg.p2caf6480}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeWidth="5"
              />
              <path
                d={mouthSvg.p13245200}
                stroke="#1E1E1E"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </>
          ),
        },
      } as const)[mouth] ?? {
        w: 24,
        h: 24,
        vb: "0 0 76.28 76.28",
        content: <path d={mainSvg.p3ad85f00} fill="#1E1E1E" />,
      };

    return (
      <svg
        x={mcx - props.w / 2}
        y={mcy - props.h / 2}
        width={props.w}
        height={props.h}
        viewBox={props.vb}
        overflow="visible"
      >
        {props.content}
      </svg>
    );
  };

  const renderEyebrows = () => {
    const y = 100;
    const cx1 = 70.59,
      cx2 = 97.04;
    const props = ({ 0: { w: 24, h: 24, vb: "0 0 76 76", content: <rect x="24.85" y="30.75" width="26.3" height="14.5" rx="7.25" fill="#1E1E1E" transform="rotate(12.28 38 38)" /> }, 1: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={eyebrowSvg.p25856680} fill="#1E1E1E" /> }, 2: { w: 24, h: 24, vb: "0 0 76.28 76.28", content: <path d={eyebrowSvg.pc212a00} fill="#1E1E1E" /> } } as const)[eyebrow];
    if (!props) return null;
    return (
      <>
        <svg x={cx1 - props.w / 2} y={y - props.h / 2} width={props.w} height={props.h} viewBox={props.vb} overflow="visible">
          <g style={{ transformOrigin: "50% 50%", transform: "none" }}>{props.content}</g>
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
      <ellipse
        cx="13.02"
        cy="5.63"
        rx="13.02"
        ry="5.63"
        fill="#090F0D"
        transform="matrix(0.986 0.165 0.415 -0.91 87.42 23.96)"
      />
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

function OptionTile({
  selected,
  locked,
  onTap,
  children,
}: {
  selected: boolean;
  locked: boolean;
  onTap: () => void;
  children: ReactNode;
}) {
  const [tooltip, setTooltip] = useState(false);

  const handleClick = () => {
    if (locked) {
      setTooltip(true);
      setTimeout(() => setTooltip(false), 1500);
    } else {
      onTap();
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className={[
          "relative aspect-square w-full overflow-hidden rounded-[13.5px] border-[3px] border-[#FFB411] flex items-center justify-center",
          locked ? "bg-[#FFE1A0] opacity-60 cursor-not-allowed" : "bg-[#FFE1A0] cursor-pointer",
          selected && !locked ? "shadow-[inset_0_0_0_3px_#FFB411]" : "",
        ].join(" ")}
        whileTap={!locked ? { scale: 0.95 } : undefined}
        animate={selected && !locked ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {locked ? (
          <span className="text-[40px] font-bold text-[#2A2A2A]" style={{ fontFamily: "Cabin, sans-serif" }}>
            ?
          </span>
        ) : (
          children
        )}
      </motion.button>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#2A2A2A] px-3 py-1.5 text-[11px] text-white"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Locked — keep leveling up!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RepoCustomizationScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TabType>("eyes");
  const [sel, setSel] = useState({ eyes: 0, mouth: 0, eyebrow: 0, color: 0, decoration: 0 });
  const [showModal, setShowModal] = useState(false);

  const tabs: { id: TabType; label: string }[] = [
    { id: "eyes", label: "Eyes" },
    { id: "mouth", label: "Mouth" },
    { id: "eyebrow", label: "Eyebrow" },
    { id: "color", label: "Color" },
    { id: "decoration", label: "Decoration" },
  ];

  const gridItems = () => {
    const total = 16;
    switch (tab) {
      case "eyes":
        return Array.from({ length: total }, (_, i) => ({ locked: i >= eyeCount, content: i < eyeCount ? <EyeTile index={i} /> : null }));
      case "mouth":
        return Array.from({ length: total }, (_, i) => ({ locked: i >= mouthCount, content: i < mouthCount ? <MouthTile index={i} /> : null }));
      case "eyebrow":
        return Array.from({ length: total }, (_, i) => ({ locked: i >= eyebrowCount, content: i < eyebrowCount ? <EyebrowTile index={i} /> : null }));
      case "color":
        return Array.from({ length: total }, (_, i) => ({ locked: i >= colorCount, content: i < colorCount ? <div className="size-full rounded-[13px]" style={{ backgroundColor: colorSwatches[i] }} /> : null }));
      case "decoration":
        return Array.from({ length: total }, (_, i) => ({ locked: i >= decorationCount, content: i < decorationCount ? <DecorationTile index={i} /> : null }));
    }
  };

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[#FFF7E7]" style={{ fontFamily: "Nunito, sans-serif" }}>
      <div className="px-[20px] pt-12">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 rounded-[30px] bg-[#FFB411] px-3 py-1 shadow-sm"
        >
          <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
            <path clipRule="evenodd" d={mainSvg.p3ac13ff0} fill="#2A2A2A" fillRule="evenodd" />
          </svg>
          <span className="text-[15px] font-bold text-[#2A2A2A]" style={{ fontFamily: "Nunito, sans-serif" }}>
            Back
          </span>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1.5 px-[20px]">
        <h1 className="text-[33px] font-bold text-[#2A2A2A]" style={{ fontFamily: "Cabin, sans-serif", letterSpacing: "-0.36px" }}>
          Customize Meepi
        </h1>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path d={mainSvg.p162d1b80} fill="#2A2A2A" />
        </svg>
      </div>

      <div className="relative mx-auto mt-6 flex h-[267px] w-full max-w-[336px] items-center justify-center gap-[22px] bg-[#FFE9B8] pl-[8px]">
        <div className="-mt-[18px]">
          <MeepiCharacter eyes={sel.eyes} mouth={sel.mouth} eyebrow={sel.eyebrow} color={sel.color} decoration={sel.decoration} />
        </div>
        <div className="flex flex-col pt-[8px]">
          <p className="text-[19px] font-bold leading-[1.3] tracking-[-0.209px] text-[#2A2A2A]">Meepi</p>
          <p className="mt-[6px] text-[15px] leading-[1.3] tracking-[-0.165px] text-[#2A2A2A]">Lvl. 13</p>
        </div>
      </div>

      <div className="no-scrollbar mx-auto mt-[15px] flex w-full max-w-[362px] gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 whitespace-nowrap rounded-[4px] px-3 py-1.5 text-[16px] text-[#2A2A2A] font-bold ${
              tab === t.id ? "bg-[#FFB411]" : "bg-[#FFE1A0]"
            }`}
            style={{ fontFamily: "Nunito, sans-serif", opacity: tab === t.id ? 1 : 0.6 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      <div className="mx-auto mt-[15px] w-full max-w-[362px] flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="grid grid-cols-4 gap-3"
          >
            {gridItems().map((item, i) => (
              <OptionTile
                key={`${tab}-${i}`}
                locked={item.locked}
                selected={sel[tab] === i && !item.locked}
                onTap={() => setSel((p) => ({ ...p, [tab]: i }))}
              >
                {item.content}
              </OptionTile>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto w-full max-w-[362px] pb-8 pt-4">
        <motion.button
          onClick={() => setShowModal(true)}
          className="flex h-[59px] w-full items-center justify-center rounded-[4px] bg-[#FFC341] shadow-sm"
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
        >
          <span className="text-[23px] font-bold text-[#2A2A2A]" style={{ fontFamily: "Cabin, sans-serif", letterSpacing: "-0.25px" }}>
            Save Modification
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-40 bg-[#FFF7E7]/80"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 z-50 w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-white p-8 shadow-xl"
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
                  <p className="mt-1 text-[14px] text-gray-500">Meepi has been updated.</p>
                </div>
                <motion.button
                  onClick={() => setShowModal(false)}
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

