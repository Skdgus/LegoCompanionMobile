import { useEffect, useRef, useState } from "react";
import {
  XP_BASE,
  addUnlockedFeature,
  type UnlockedFeatures,
} from "../screens/OnboardingScreen";
import {
  EyesIcon,
  MouthIcon,
  EyebrowIcon,
  DecorationIcon,
} from "../screens/customization/CompanionCustomizationScreen";

// ─── XP threshold helpers ──────────────────────────────────────────────────────
//
// Each reward index N (0-based) requires the user to fill level (N+1).
// Level caps grow linearly: level 1 = 50 XP, level 2 = 100 XP, …
//
// Total XP needed to unlock reward N:
//   threshold(N) = XP_BASE * N * (N+1) / 2
//
//   threshold(0) =   0  → reward 0 requires  0→50 XP  (cap = 50)
//   threshold(1) =  50  → reward 1 requires 50→150 XP (cap = 100)
//   threshold(2) = 150  → reward 2 requires 150→300 XP (cap = 150)
//
function thresholdForReward(n: number): number {
  return (XP_BASE * n * (n + 1)) / 2;
}
function capForReward(n: number): number {
  return (n + 1) * XP_BASE;
}

// ─── Reward sequence ───────────────────────────────────────────────────────────
export const REWARD_QUEUE: { tab: keyof UnlockedFeatures; index: number }[] = [
  { tab: "eyes",       index: 1 }, { tab: "mouth",      index: 1 },
  { tab: "eyes",       index: 2 }, { tab: "mouth",      index: 2 },
  { tab: "eyebrow",    index: 1 }, { tab: "eyes",       index: 3 },
  { tab: "mouth",      index: 3 }, { tab: "eyebrow",    index: 2 },
  { tab: "decoration", index: 1 }, { tab: "eyes",       index: 4 },
  { tab: "mouth",      index: 4 }, { tab: "decoration", index: 2 },
  { tab: "eyes",       index: 5 }, { tab: "mouth",      index: 5 },
  { tab: "eyebrow",    index: 3 }, { tab: "decoration", index: 3 },
  { tab: "eyes",       index: 6 }, { tab: "mouth",      index: 6 },
  { tab: "decoration", index: 4 }, { tab: "eyes",       index: 7 },
  { tab: "mouth",      index: 7 }, { tab: "decoration", index: 5 },
  { tab: "eyes",       index: 8 }, { tab: "mouth",      index: 8 },
  { tab: "eyes",       index: 9 }, { tab: "mouth",      index: 9 },
];

const REWARD_CLAIMED_KEY = "progress.rewardsClaimed";
export function loadRewardsClaimed(): number {
  return parseInt(localStorage.getItem(REWARD_CLAIMED_KEY) ?? "0", 10);
}
function saveRewardsClaimed(n: number) {
  localStorage.setItem(REWARD_CLAIMED_KEY, String(n));
}

// ─── Icon renderer ─────────────────────────────────────────────────────────────
// overflow-hidden + flex centering ensure fixed-size icons (size-8, size-10)
// don't bleed outside the milestone box.
function RewardIcon({ tab, index, size }: {
  tab: keyof UnlockedFeatures; index: number; size: number;
}) {
  return (
    <div
      className="pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {tab === "eyes"       && <EyesIcon       variant={index} />}
      {tab === "mouth"      && <MouthIcon      variant={index} />}
      {tab === "eyebrow"    && <EyebrowIcon    variant={index} />}
      {tab === "decoration" && <DecorationIcon variant={index} />}
    </div>
  );
}

// ─── Single milestone box ─────────────────────────────────────────────────────
// Coordinates are absolute within the 362×171 card, taken directly from
// progressbar.svg:
//
//  Box L2  x=12,  y=70  w=43 h=40  inner: dx=+4.5 dy=+3.5 w=33.28 h=33.28
//  Box L1  x=80,  y=70  w=43 h=40  inner: dx=+4.5 dy=+3.5 w=33.28 h=33.28
//  Center  x=152, y=60  w=59 h=60  inner: dx=+6.5 dy=+6.5 w=46.72 h=46.72
//          outer-stroke: x=147.5 y=55.5 w=68 h=69 rx=4.5 stroke=#FFB411
//  Box R1  x=241, y=70  w=41 h=40  inner: dx=+3.5 dy=+3.5 w=33.28 h=33.28
//  Box R2  x=307, y=70  w=43 h=40  inner: dx=+4.5 dy=+3.5 w=33.28 h=33.28
//
function MilestoneBox({
  bx, by, bw, bh,
  idx, idy, iw, ih,
  bg,
  reward, iconSize,
  isCenter = false,
  canClaim  = false,
  onClick,
}: {
  bx: number; by: number; bw: number; bh: number;
  idx: number; idy: number; iw: number; ih: number;
  bg: string;
  reward: { tab: keyof UnlockedFeatures; index: number } | null;
  iconSize: number;
  isCenter?: boolean;
  canClaim?: boolean;
  onClick?: () => void;
}) {
  const interactive = isCenter && !!onClick;
  const live        = interactive && canClaim;

  return (
    <div className="absolute" style={{ left: bx, top: by, width: bw, height: bh }}>

      {/* Outer stroke ring — center only (SVG: x=147.5 y=55.5 w=68 h=69 rx=4.5) */}
      {isCenter && (
        <div
          className="pointer-events-none absolute rounded-[4.5px] border border-[#FFB411]"
          style={{ left: -4.5, top: -4.5, width: 68, height: 69 }}
        />
      )}

      {/* Outer coloured rect */}
      <div
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={live ? onClick : undefined}
        onKeyDown={live ? (e) => { if (e.key === "Enter" || e.key === " ") onClick?.(); } : undefined}
        className={[
          "absolute inset-0 rounded-[5px] select-none",
          live        ? "cursor-pointer transition-transform active:scale-[0.97]" : "",
          isCenter && !canClaim ? "opacity-60 cursor-not-allowed" : "",
        ].filter(Boolean).join(" ")}
        style={{ backgroundColor: bg }}
      >
        {/* Inner frame — #FFE9B8-stroked inner rect matching SVG */}
        <div
          className="absolute flex items-center justify-center overflow-hidden rounded-[3.5px]"
          style={{
            left: idx, top: idy, width: iw, height: ih,
            backgroundColor: bg,
            border: "3px solid #FFE9B8",
          }}
        >
          {reward && <RewardIcon tab={reward.tab} index={reward.index} size={iconSize} />}
        </div>
      </div>
    </div>
  );
}

// ─── ProgressPanel ─────────────────────────────────────────────────────────────
// Pixel-perfect recreation of progressbar.svg (362×171).
//
// XP is CUMULATIVE — it never resets. The current level and bar fill are
// derived from `claimed` (reward index) and cumulative `xp`:
//
//   level displayed  = claimed + 1
//   cap for level    = (claimed + 1) × XP_BASE
//   xp within level  = xp  −  thresholdForReward(claimed)
//   barFull          = xpInLevel ≥ cap   (>= so exactly hitting cap works)
//
// SVG layout (left → right):
//  ┌──────────────────────────────────────────────────────────────┐
//  │  Lvl. X                                       X / Y XP      │  y≈26
//  │  [L2 claimed]  [L1 claimed]  [■ CENTER ■]  [R1]  [R2]      │  y=60–110
//  │   x=12          x=80          x=152          x=241  x=307   │
//  │   #FFB411       #FFB411       #FFB411        #B3C5DA #B3C5DA │
//  │─────────────────── track (x=12 y=85 w=338 h=10) ──────────  │
//  │  X more tasks till next reward!                              │  y≈142
//  └──────────────────────────────────────────────────────────────┘
//
export function ProgressPanel({ xp, onRewardClaimed }: {
  xp: number;
  onRewardClaimed: () => void;
}) {
  const [toast,   setToast]   = useState<string | null>(null);
  const [claimed, setClaimed] = useState(() => loadRewardsClaimed());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // ── XP math ────────────────────────────────────────────────────────────────
  const cap        = capForReward(claimed);                          // XP needed this level
  const xpInLevel  = Math.max(0, xp - thresholdForReward(claimed)); // XP earned this level
  const fillPct    = Math.min(100, (xpInLevel / cap) * 100);
  const barFull    = xpInLevel >= cap;
  const level      = claimed + 1;

  // ── Reward slots ───────────────────────────────────────────────────────────
  //
  //  LEFT (yellow — past claimed):
  //    L2 = REWARD_QUEUE[claimed − 2]  (oldest visible)
  //    L1 = REWARD_QUEUE[claimed − 1]  (most recent before center)
  //  CENTER (yellow — current reward to claim):
  //    C  = REWARD_QUEUE[claimed]
  //  RIGHT (blue-gray — upcoming locked):
  //    R1 = REWARD_QUEUE[claimed + 1]
  //    R2 = REWARD_QUEUE[claimed + 2]
  //
  const ctr = REWARD_QUEUE[claimed]     ?? null;
  const L1  = claimed >= 1 ? REWARD_QUEUE[claimed - 1] : null;
  const L2  = claimed >= 2 ? REWARD_QUEUE[claimed - 2] : null;
  const R1  = REWARD_QUEUE[claimed + 1] ?? null;
  const R2  = REWARD_QUEUE[claimed + 2] ?? null;

  function handleClaim() {
    if (!ctr || !barFull) return;
    addUnlockedFeature(ctr.tab, ctr.index);
    const next = claimed + 1;
    saveRewardsClaimed(next);
    setClaimed(next);
    setToast("Reward received!");
    onRewardClaimed();
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2200);
  }

  // ── Bottom hint text ────────────────────────────────────────────────────────
  const xpNeeded   = cap - xpInLevel;
  const tasksLeft  = Math.max(1, Math.ceil(xpNeeded / 15));
  const bottomText = toast
    ? `✅ ${toast}`
    : barFull
      ? "Tap the center box to claim your reward!"
      : `${tasksLeft} more task${tasksLeft !== 1 ? "s" : ""} till next reward!`;

  return (
    <div
      className="relative overflow-hidden rounded-[10px] bg-[#FFE9B8]"
      style={{ width: 362, height: 171 }}
    >

      {/* Top-left: "Lvl. X" — SVG glyph top y≈25.75, baseline y≈37.15 */}
      <p
        className="absolute font-extrabold leading-none text-[#2a2a2a]"
        style={{ fontSize: 13, left: 20, top: 26 }}
      >
        Lvl. {level}
      </p>

      {/* Top-right: "X / Y XP" — right-aligned, same baseline */}
      <p
        className="absolute text-right font-extrabold leading-none text-[#2a2a2a]"
        style={{ fontSize: 13, right: 20, top: 26 }}
      >
        {xpInLevel} / {cap} XP
      </p>

      {/* Track bar — SVG: x=12 y=85 w=338 h=10 rx=5 */}
      <div
        className="absolute overflow-hidden rounded-[5px] bg-[#B3C5DA]"
        style={{ left: 12, top: 85, width: 338, height: 10 }}
      >
        <div
          className="h-full rounded-[5px] bg-[#FFB411] transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(1, fillPct)}%` }}
        />
      </div>

      {/* L2 — oldest claimed (yellow). SVG: x=12 y=70 w=43 h=40 */}
      {L2 && (
        <MilestoneBox
          bx={12} by={70} bw={43} bh={40}
          idx={4.5} idy={3.5} iw={33.28} ih={33.28}
          bg="#FFB411" reward={L2} iconSize={20}
        />
      )}

      {/* L1 — most recent claimed (yellow). SVG: x=80 y=70 w=43 h=40 */}
      {L1 && (
        <MilestoneBox
          bx={80} by={70} bw={43} bh={40}
          idx={4.5} idy={3.5} iw={33.28} ih={33.28}
          bg="#FFB411" reward={L1} iconSize={20}
        />
      )}

      {/* CENTER — active reward to claim (yellow, large). SVG: x=152 y=60 w=59 h=60 */}
      {ctr && (
        <MilestoneBox
          bx={152} by={60} bw={59} bh={60}
          idx={6.5} idy={6.5} iw={46.72} ih={46.72}
          bg="#FFB411" reward={ctr} iconSize={30}
          isCenter canClaim={barFull} onClick={handleClaim}
        />
      )}

      {/* R1 — next upcoming locked (blue-gray). SVG: x=241 y=70 w=41 h=40 */}
      {R1 && (
        <MilestoneBox
          bx={241} by={70} bw={41} bh={40}
          idx={3.5} idy={3.5} iw={33.28} ih={33.28}
          bg="#B3C5DA" reward={R1} iconSize={20}
        />
      )}

      {/* R2 — second upcoming locked (blue-gray). SVG: x=307 y=70 w=43 h=40 */}
      {R2 && (
        <MilestoneBox
          bx={307} by={70} bw={43} bh={40}
          idx={4.5} idy={3.5} iw={33.28} ih={33.28}
          bg="#B3C5DA" reward={R2} iconSize={20}
        />
      )}

      {/* Bottom text — SVG centered at x≈181, baseline y=153 */}
      <p
        className="absolute w-full text-center font-bold leading-none text-[#949494]"
        style={{ fontSize: 11, top: 142 }}
      >
        {bottomText}
      </p>

    </div>
  );
}
