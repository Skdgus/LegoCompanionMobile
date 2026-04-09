import { useEffect, useState } from "react";
import leafIcon       from "../../assets/tabler_leaf-filled.svg";
import placeIcon1st   from "../../assets/place-icon-1st.svg";
import placeIcon2nd   from "../../assets/place-icon-2nd.svg";
import placeIcon3rd   from "../../assets/place-icon-3rd.svg";
import {
  ALL_BADGES,
  type BadgeDef,
  loadBadgeSelection,
  saveBadgeSelection,
} from "../data/badgeData";
import { ProgressPanel } from "../components/ProgressPanel";
import { loadXp } from "./OnboardingScreen";

// ─── BadgeTile ────────────────────────────────────────────────────────────────
// Pixel-perfect to Badge Component SVG (177 × 339).
//
// Text spacing fix: title block moved to top-[214px] so that two-line titles
// ("Human\nWater Tank") don't push the subtitle into the XP pill at y=284.
//   2-line title: y=214→252, subtitle: y=258→272, XP pill: y=284  ✓
//   1-line title: y=214→233, subtitle: y=243→257, XP pill: y=284  ✓
//
function BadgeTile({
  badge,
  selected,
  onClick,
}: {
  badge: BadgeDef;
  selected: boolean;
  onClick: () => void;
}) {
  const cardBg  = selected ? "#FFB411" : "#8A6A16";
  const pillBg  = selected ? "#FFE9B8" : "rgba(255,233,184,0.35)";
  const textOp  = selected ? "" : "opacity-55";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[339px] w-[177px] overflow-hidden rounded-[20px] text-left transition active:scale-[0.997]"
      style={{ backgroundColor: cardBg }}
      aria-pressed={selected}
    >
      {/* top-right leaf-reward pill */}
      <div
        className="absolute right-[12px] top-[12px] flex h-[25px] w-[65px] items-center rounded-full"
        style={{ backgroundColor: pillBg }}
      >
        <span className={`ml-[8px] text-[15px] font-extrabold leading-none text-[#212121] ${textOp}`}>
          +{badge.leafReward}
        </span>
        <span className="absolute right-[8px] top-[5px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#ffb411]">
          <img src={leafIcon} alt="" width={10} height={9} className="block" draggable={false} />
        </span>
      </div>

      {/* badge SVG icon — centred horizontally, upper area of card */}
      <img
        src={badge.icon}
        alt={badge.title}
        width={80}
        height={96}
        className={`absolute left-[48px] top-[75px] block select-none transition-opacity ${selected ? "" : "opacity-50"}`}
        draggable={false}
      />

      {/* title + subtitle — top-[200px] gives 10 px clearance above XP pill for
          the worst case: 2-line title (38 px) + mt-6 + 2-line subtitle (30 px) = 74 px
          → block bottom = 274, XP pill = 284, gap = 10 px ✓                          */}
      <div className="absolute left-[14px] right-[14px] top-[196px] overflow-hidden" style={{ maxHeight: 82 }}>
        <p className={`whitespace-pre-line text-[16px] font-extrabold leading-[19px] text-[#212121] ${textOp}`}>
          {badge.title}
        </p>
        {/* subtitle: inline style handles opacity; no redundant className opacity */}
        <p
          className="mt-[6px] whitespace-pre-line text-[15px] font-bold leading-[18px] text-[#2a2a2a]"
          style={{ opacity: selected ? 0.55 : 0.3 }}
        >
          {badge.subtitle}
        </p>
      </div>

      {/* bottom XP pill */}
      <div
        className="absolute left-[12px] top-[284px] flex h-[43px] w-[78px] items-center rounded-[5px]"
        style={{ backgroundColor: pillBg }}
      >
        <span className={`ml-[10px] text-[16px] font-extrabold leading-none text-[#212121] ${textOp}`}>
          +{badge.xpReward}
        </span>
        <span className={`ml-[2px] text-[15px] font-extrabold leading-none text-[#212121] ${textOp}`}>XP</span>
      </div>
    </button>
  );
}

// ─── Place icon map ───────────────────────────────────────────────────────────
const PLACE_ICONS: Record<1|2|3, string> = {
  1: placeIcon1st,
  2: placeIcon2nd,
  3: placeIcon3rd,
};

// ─── MostAchievedCard ─────────────────────────────────────────────────────────
// Uses the provided place-icon SVGs (44×44, already include circle + number).
function MostAchievedCard({
  width, title, days, place,
}: { width: number; title: string; days: number; place: 1|2|3 }) {
  return (
    <div className="relative h-[85px] rounded-[10px] bg-[#ffe9b8]" style={{ width }}>
      <div className="absolute left-[20px] top-[22.5px]">
        <p className="text-[15px] font-extrabold leading-[18px] text-[#212121]">{title}</p>
        <p className="mt-[6px] text-[15px] font-bold leading-[18px] text-[#2a2a2a]/55">{days} days</p>
      </div>
      {/* Place icon — 44×44 SVG already includes the yellow circle + number */}
      <img
        src={PLACE_ICONS[place]}
        alt={`${place === 1 ? "1st" : place === 2 ? "2nd" : "3rd"} place`}
        width={44}
        height={44}
        className="absolute right-[20px] top-[20.5px] block select-none"
        draggable={false}
      />
    </div>
  );
}

// ─── DeedScreen ───────────────────────────────────────────────────────────────
export function DeedScreen() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => loadBadgeSelection());

  // XP state — polled from localStorage so ProgressPanel stays live
  const [xp, setXp] = useState(() => loadXp());
  useEffect(() => {
    const id = window.setInterval(() => setXp(loadXp()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[402px] bg-app-bg pb-[calc(87px+env(safe-area-inset-bottom,0px)+62px)]">
      <div className="px-[18px] pt-[64px]">

        {/* ── Achievements — ProgressPanel (same as HomePage) ── */}
        <div className="w-[366px]">
          <h1 className="text-[28px] font-extrabold leading-[50px] text-[#212121]">Achievements</h1>
          <div className="mt-[20px]">
            <ProgressPanel xp={xp} onRewardClaimed={() => setXp(loadXp())} />
          </div>
        </div>

        {/* ── Most Achieved Tasks ── */}
        <div className="mt-[36px] w-[366px]">
          <h2 className="text-[20px] font-extrabold leading-[35px] text-[#212121]">Most Achieved Tasks</h2>
          <div className="mt-[8px] flex flex-col gap-[8px]">
            <MostAchievedCard width={362} title="Drink Water"   days={23} place={1} />
            <MostAchievedCard width={248} title="Stretch Break" days={18} place={2} />
            <MostAchievedCard width={202} title="Short Walk"    days={13} place={3} />
          </div>
        </div>

        {/* ── Badges grid ── */}
        <div className="mt-[36px] w-[366px]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[20px] font-extrabold leading-[35px] text-[#212121]">Badges</h2>
            <span className="text-[15px] font-bold text-[#949494]">{selectedIds.size}/{ALL_BADGES.length} earned</span>
          </div>

          <div className="mt-[8px] grid grid-cols-2 gap-x-[10px] gap-y-[10px]">
            {ALL_BADGES.map((b) => (
              <BadgeTile
                key={b.id}
                badge={b}
                selected={selectedIds.has(b.id)}
                onClick={() => {
                  setSelectedIds((cur) => {
                    const next = new Set(cur);
                    if (next.has(b.id)) next.delete(b.id);
                    else next.add(b.id);
                    // Save immediately — consistent with BadgeCollectionScreen
                    saveBadgeSelection(next);
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
