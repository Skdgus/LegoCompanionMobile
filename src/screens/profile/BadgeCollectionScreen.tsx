import { useEffect, useState } from "react";
import backIcon from "../../../assets/weui_back-filled.svg";
import leafIcon from "../../../assets/tabler_leaf-filled.svg";
import {
  ALL_BADGES,
  type BadgeDef,
  loadBadgeSelection,
  saveBadgeSelection,
  BADGE_SELECTION_KEY,
} from "../../data/badgeData";

type Props = { onBack: () => void };

// ─── Small badge tile matching DeedScreen style ───────────────────────────────
function CollectionBadgeTile({ badge, selected, onClick }: { badge: BadgeDef; selected: boolean; onClick: () => void }) {
  const cardBg = selected ? "#FFB411" : "#8A6A16";
  const pillBg = selected ? "#FFE9B8" : "rgba(255,233,184,0.35)";
  const textOp = selected ? "" : "opacity-55";

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[339px] w-full overflow-hidden rounded-[20px] text-left transition active:scale-[0.997]"
      style={{ backgroundColor: cardBg }}
      aria-pressed={selected}
    >
      {/* top-right leaf pill */}
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

      {/* badge icon — centered, upper area */}
      <img
        src={badge.icon}
        alt={badge.title}
        width={80}
        height={96}
        className={`absolute left-[calc(50%-40px)] top-[75px] block select-none ${selected ? "" : "opacity-50"}`}
        draggable={false}
      />

      {/* title + subtitle */}
      <div className="absolute left-[14px] right-[14px] top-[228px]">
        <p className={`whitespace-pre-line text-[16px] font-extrabold leading-[19px] text-[#212121] ${textOp}`}>
          {badge.title}
        </p>
        <p
          className={`mt-[8px] whitespace-pre-line text-[15px] font-bold leading-[18px] text-[#2a2a2a] ${textOp}`}
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

// ─── Screen ───────────────────────────────────────────────────────────────────
export function BadgeCollectionScreen({ onBack }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => loadBadgeSelection());

  // Keep in sync with DeedScreen via localStorage polling
  useEffect(() => {
    const refresh = () => setSelectedIds(loadBadgeSelection());
    const onStorage = (e: StorageEvent) => { if (e.key === BADGE_SELECTION_KEY) refresh(); };
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(refresh, 800);
    return () => { window.removeEventListener("storage", onStorage); window.clearInterval(id); };
  }, []);

  const earnedCount = ALL_BADGES.filter((b) => selectedIds.has(b.id)).length;

  return (
    <div className="relative mx-auto w-full max-w-[402px] bg-app-bg" style={{ minHeight: "100dvh" }}>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-[15px] top-[64px] flex h-[31px] w-[74px] items-center rounded-full bg-[#FFB411] shadow-sm"
        aria-label="Back"
      >
        <img src={backIcon} alt="" width={8} height={16} className="absolute left-[12px] top-[7.5px] block" draggable={false} aria-hidden />
        <span className="absolute left-[25px] top-[4px] text-[14px] font-extrabold leading-[23px] text-[#2a2a2a]">Back</span>
      </button>

      <div className="px-[18px] pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)] pt-[120px]">
        <h1 className="text-[28px] font-extrabold leading-[40px] text-[#212121]">Badge Collection</h1>
        <p className="mt-[4px] text-[14px] font-bold text-[#949494]">
          {earnedCount} / {ALL_BADGES.length} earned
        </p>

        <div className="mt-[20px] grid grid-cols-2 gap-x-[10px] gap-y-[10px]">
          {ALL_BADGES.map((b) => (
            <CollectionBadgeTile
              key={b.id}
              badge={b}
              selected={selectedIds.has(b.id)}
              onClick={() => {
                setSelectedIds((cur) => {
                  const next = new Set(cur);
                  if (next.has(b.id)) next.delete(b.id);
                  else next.add(b.id);
                  saveBadgeSelection(next);
                  return next;
                });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
