import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCompanionName } from "./OnboardingScreen";
import type { TaskRowModel } from "../components/TaskCardRow";
import iconWater from "../../assets/mdi_water.svg";
import iconApple from "../../assets/fluent_food-apple-24-filled.svg";
import iconExercise from "../../assets/material-symbols_exercise.svg";
import iconThunder from "../../assets/boxicons_thunder-filled.svg";
import { MeepiAvatar } from "../components/MeepiAvatar";
import { StandbyActiveScreen } from "./standby/StandbyActiveScreen";
import { StandbyAnimationOverlay } from "./standby/StandbyAnimationOverlay";

// ── Expression SVGs ───────────────────────────────────────────────────────────
import exprImg1 from "../../assets/expression-1.svg";
import exprImg2 from "../../assets/expression-2.svg";
import exprImg3 from "../../assets/expression-3.svg";
import exprImg4 from "../../assets/expression-4.svg";
import exprImg5 from "../../assets/expression-5.svg";
import exprImg6 from "../../assets/expression-6.svg";
import exprImg7 from "../../assets/expression-7.svg";
import exprImg8 from "../../assets/expression-8.svg";
import exprImg9 from "../../assets/expression-9.svg";
const EXPR_IMGS = [exprImg1, exprImg2, exprImg3, exprImg4, exprImg5, exprImg6, exprImg7, exprImg8, exprImg9];


/** Frame 560:1261 — Companion Page 402×874 */
const FRAME_W = 402;

type PalStat = {
  label: string;
  icon: string;
  fill: string;
  pct: number;
};

/** Keyword sets that map task titles → stat categories */
const STAT_KEYWORDS: Record<string, string[]> = {
  Hydration: ["water", "drink", "hydrat", "fluid", "juice", "tea", "coffee"],
  Hunger:    ["eat", "dinner", "breakfast", "lunch", "food", "meal", "snack", "cook"],
  Energy:    ["walk", "exercise", "workout", "gym", "run", "stretch", "sport", "jog", "cardio", "yoga", "min"],
  Mood:      ["sleep", "break", "rest", "meditat", "relax", "journal", "mood", "brush", "teeth", "hygiene", "nap", "calm"],
};

/** Base percentages shown when no matching tasks exist */
const STAT_BASE: Record<string, number> = {
  Hydration: 20,
  Hunger: 20,
  Energy: 20,
  Mood: 20,
};

export function computePct(label: string, tasks: TaskRowModel[]): number {
  const keywords = STAT_KEYWORDS[label] ?? [];
  const matching = tasks.filter((t) =>
    keywords.some((k) => t.title.toLowerCase().includes(k))
  );
  if (matching.length === 0) return STAT_BASE[label] ?? 20;
  const done = matching.filter((t) => t.done).length;
  return Math.round((done / matching.length) * 100);
}

const PAL_STAT_DEFS: Omit<PalStat, "pct">[] = [
  { label: "Hydration", icon: iconWater,    fill: "#2196f3" },
  { label: "Hunger",    icon: iconApple,    fill: "#e53935" },
  { label: "Energy",    icon: iconExercise, fill: "#212121" },
  { label: "Mood",      icon: iconThunder,  fill: "#fff9c4" },
];

const ICON_CIRCLE = 49.166446685791016;
const BAR_W = 147;
const BAR_H = 11;
const CARD_W = 175;
const CARD_H = 116;        // expanded to fit number row + 8px gap above bar
const GAP_X = 12;
const GAP_Y = 12;

function ThoughtBubble({ style }: { style?: CSSProperties }) {
  return (
    <svg
      width="104"
      height="140"
      viewBox="0 0 104 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute z-[5]"
      style={style}
      aria-hidden
    >
      <path
        d="M18.1693 10.2316C-12.0012 19.4235 6.43621 39.1201 6.43621 39.1201C6.43621 39.1201 -3.62034 49.625 1.4079 60.1299C6.43614 70.6348 26.55 75.4496 38.2829 74.5742C55.0443 85.0791 101.976 75.8861 100.3 57.5033C108.346 50.1499 101.418 42.1837 96.9478 39.1197C110.357 18.1092 86.3323 7.16769 76.8341 6.29226C71.4705 3.14079 59.514 1.03973 55.0443 2.35284C36.6068 -2.90025 23.1977 1.03981 18.1693 10.2316Z"
        fill="#FFF7E7"
      />
      <circle cx="42.5" cy="96.5" r="9.5" fill="#FFF7E7" />
      <circle cx="34" cy="120" r="6" fill="#FFF7E7" />
      <circle cx="21" cy="136" r="4" fill="#FFF7E7" />
    </svg>
  );
}

function PalStatCard({ label, icon, fill, pct }: PalStat) {
  return (
    <div
      className="flex flex-col rounded-[16px] px-[12px] pt-[12px] pb-[10px]"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: "var(--color-pal-card)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
      }}
    >
      {/* Icon + label row */}
      <div className="flex items-start gap-2">
        <div
          className="flex shrink-0 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          style={{ width: ICON_CIRCLE, height: ICON_CIRCLE }}
        >
          <img src={icon} alt="" className="h-[30px] w-[30px] object-contain" aria-hidden />
        </div>
        <span className="pt-[2px] text-[17px] font-extrabold leading-[29px] text-[#1a1a1a]">{label}</span>
      </div>

      {/* Percentage — 8px above bar */}
      <div className="mt-[8px] flex justify-end" style={{ marginBottom: 8 }}>
        <span className="text-[13px] font-extrabold text-[#1a1a1a]/60">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div
        className="overflow-hidden rounded-full bg-white"
        style={{ width: BAR_W, height: BAR_H }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function StandbyIcon() {
  return (
    <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <mask
        id="standby-mask"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="22" y="4" width="19" height="31"
      >
        <path
          d="M40 4.98474H23C22.4477 4.98474 22 5.43246 22 5.98474V33.9847C22 34.537 22.4477 34.9847 23 34.9847H40C40.5523 34.9847 41 34.537 41 33.9847V5.98474C41 5.43246 40.5523 4.98474 40 4.98474Z"
          fill="white"
        />
      </mask>
      <g mask="url(#standby-mask)">
        <path
          d="M40 4.98474H23C22.4477 4.98474 22 5.43246 22 5.98474V33.9847C22 34.537 22.4477 34.9847 23 34.9847H40C40.5523 34.9847 41 34.537 41 33.9847V5.98474C41 5.43246 40.5523 4.98474 40 4.98474Z"
          stroke="#2A2A2A"
          strokeWidth="4"
        />
      </g>
      <path
        d="M26.2594 26.2594C29.1567 23.3621 29.1567 18.6529 26.2594 15.7556C23.3622 12.8583 18.653 12.8583 15.7557 15.7556C12.8584 18.6529 12.8584 23.3621 15.7557 26.2594L17.944 28.4476"
        stroke="#2A2A2A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1296 28.8853H18.3815V23.6334"
        stroke="#2A2A2A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35 29.9996H28C27.4477 29.9996 27 30.4473 27 30.9996C27 31.5519 27.4477 31.9996 28 31.9996H35C35.5523 31.9996 36 31.5519 36 30.9996C36 30.4473 35.5523 29.9996 35 29.9996Z"
        fill="#2A2A2A"
      />
    </svg>
  );
}

type StandbyPhase = "none" | "anim" | "active";

type Props = {
  onCustomize: () => void;
  onClose?: () => void;
  tasks?: TaskRowModel[];
};

export function CompanionPalScreen({ onCustomize, onClose, tasks = [] }: Props) {
  const [standby, setStandby] = useState<StandbyPhase>("none");
  const animDone = useCallback(() => setStandby("active"), []);
  const leaveStandby = useCallback(() => setStandby("none"), []);
  const [palName, setPalName] = useState(() => getCompanionName());
  useEffect(() => {
    const id = window.setInterval(() => setPalName(getCompanionName()), 800);
    return () => window.clearInterval(id);
  }, []);

  // Compute live stat percentages from current task state
  const palStats: PalStat[] = PAL_STAT_DEFS.map((def) => ({
    ...def,
    pct: computePct(def.label, tasks),
  }));

  // ── Tap expression ──────────────────────────────────────────────────────
  const [exprIdx,     setExprIdx]     = useState(0);
  const [exprVisible, setExprVisible] = useState(false);
  const exprTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCompanionTap = useCallback(() => {
    if (exprTimer.current) clearTimeout(exprTimer.current);
    setExprIdx((i) => (i + 1) % EXPR_IMGS.length);
    setExprVisible(true);
    exprTimer.current = setTimeout(() => setExprVisible(false), 900);
  }, []);

  useEffect(() => () => { if (exprTimer.current) clearTimeout(exprTimer.current); }, []);

  return (
    <div
      className="relative mx-auto w-full overflow-hidden bg-pal-screen pb-[calc(87px+env(safe-area-inset-bottom,0px)+16px)]"
      style={{
        maxWidth: FRAME_W,
        minHeight: 874,
      }}
    >
      {/* Close button — only shown when rendered as a popup */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[16px] top-[16px] z-20 flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#ffc542] text-[20px] font-bold leading-none text-[#1a1a1a] shadow-sm transition active:scale-95"
          aria-label="Close"
        >
          ×
        </button>
      )}
      {/* Group 281 — ellipses + character (overflow sides) */}
      <div
        className="pointer-events-none absolute left-0 overflow-visible"
        style={{ top: 145, width: FRAME_W, height: 385 }}
      >
        <div
          className="absolute"
          style={{ left: -39, width: 481, height: 385 }}
        >
          <div
            className="absolute rounded-[50%] opacity-95"
            style={{
              left: 0,
              top: 189,
              width: 481,
              height: 174,
              background: "var(--color-pal-platform-top)",
            }}
          />
          <div
            className="absolute rounded-[50%]"
            style={{
              left: 0,
              top: 167,
              width: 481,
              height: 174,
              background: "var(--color-pal-platform-deep)",
            }}
          />
          <button
            type="button"
            aria-label="Tap companion"
            className="absolute flex cursor-pointer items-start justify-center border-0 bg-transparent p-0 pointer-events-auto focus-visible:outline-none"
            style={{ left: 107, top: 0, width: 256, height: 241 }}
            onClick={onCompanionTap}
          >
            <MeepiAvatar
              width={256}
              height={241}
              className="h-auto w-[256px] max-w-none"
              expressionSrc={EXPR_IMGS[exprIdx]}
              expressionVisible={exprVisible}
            />
          </button>
        </div>
      </div>

      {/* Thought bubble + caption centred inside it */}
      <div className="pointer-events-none absolute z-[5]" style={{ left: 259, top: 123 }}>
        <ThoughtBubble />
        {/* z-[6] keeps the text above the bubble SVG's z-[5] */}
        <div
          className="absolute left-0 top-0 z-[6] flex items-center justify-center px-3 text-center"
          style={{ width: 104, height: 76 }}
        >
          <span className="text-[13px] font-semibold leading-[1.25] text-[#1a1a1a]">
            Craving a snack
          </span>
        </div>
      </div>

      {/* Expression is now rendered inside MeepiAvatar's SVG, behind the body overlay paths */}

      <h1 className="relative z-10 min-w-0 pl-5 pt-[111px] text-[26px] font-extrabold leading-[33px] text-[#1a1a1a]">
        {palName}
      </h1>

      {/* Frame — stats + edit: y=409, 362×264.17 */}
      <div className="relative z-10 mx-auto mt-[238px] w-[362px]">
        <button
          type="button"
          onClick={onCustomize}
          className="absolute right-0 top-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-pal-card shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition hover:brightness-95 active:scale-95"
          aria-label="Edit companion"
        >
          <PencilIcon />
        </button>

        <div className="pt-[60px]">
          <div className="flex flex-col" style={{ gap: GAP_Y }}>
            <div className="flex" style={{ gap: GAP_X }}>
              <PalStatCard {...palStats[0]} />
              <PalStatCard {...palStats[1]} />
            </div>
            <div className="flex" style={{ gap: GAP_X }}>
              <PalStatCard {...palStats[2]} />
              <PalStatCard {...palStats[3]} />
            </div>
          </div>
        </div>
      </div>

      {/* Standby — y=709 */}
      <div className="relative z-10 mx-auto pt-[35.834px]" style={{ width: 362 }}>
        <button
          type="button"
          onClick={() => setStandby("anim")}
          className="flex w-full items-center justify-center gap-3 rounded-[20px] py-[14px] transition hover:brightness-95 active:scale-[0.99]"
          style={{
            height: 65,
            background: "var(--color-pal-card)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
          }}
        >
          <StandbyIcon />
          <span className="text-[17px] font-extrabold leading-[35px] text-[#1a1a1a]">Companion Mode</span>
        </button>
      </div>

      {standby === "anim" && <StandbyAnimationOverlay onComplete={animDone} />}
      {standby === "active" && <StandbyActiveScreen onLeave={leaveStandby} />}
    </div>
  );
}
