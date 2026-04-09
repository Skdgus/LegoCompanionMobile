import { useEffect, useRef, useState } from "react";
import backIcon from "../../assets/weui_back-filled.svg";
import { ALL_BADGES, loadBadgeSelection, BADGE_SELECTION_KEY } from "../data/badgeData";
import bambooBuildImg from "../../assets/bamboo-build.png";
import flowerBuildImg from "../../assets/flower-build.png";
import instructionImg1 from "../../assets/instruction-img1.png";
import instructionImg2 from "../../assets/instruction-img2.png";
import instructionImg3 from "../../assets/instruction-img3.png";
import { MeepiFaceIcon } from "../components/MeepiFaceIcon";

// ─── Color swatches (mirrors CompanionCustomizationScreen) ───────────────────
const COLOR_SWATCHES = [
  "#3a4175", "#d7bace", "#eca2c0", "#e585ab", "#d3716e",
  "#c4210c", "#d3762b", "#aa9542", "#eed167", "#dfe596",
  "#769875", "#0d8991", "#84bfea", "#416fa3",
] as const;

function lightenHex(hex: string, amt: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function getCompanionBodyColor(): string {
  try {
    const raw = localStorage.getItem("meepiCustomization.v1");
    if (!raw) return "#84bfea";
    const parsed = JSON.parse(raw) as { color?: number };
    return COLOR_SWATCHES[parsed.color ?? 12] ?? "#84bfea";
  } catch {
    return "#84bfea";
  }
}

// ─── Stat card — color-tinted from companion ─────────────────────────────────
function StatCard({ value, label, color }: { value: number | string; label: string; color: string }) {
  return (
    <div
      className="flex h-[95px] w-full flex-col items-center justify-center rounded-[12px]"
      style={{ backgroundColor: color }}
    >
      <p className="text-[22px] font-extrabold leading-[30px] text-[#2a2a2a]">{value}</p>
      <p className="mt-[8px] text-[15px] font-bold leading-[20px] text-[#2a2a2a]">{label}</p>
    </div>
  );
}

// ─── Badge preview tile ───────────────────────────────────────────────────────
// Shows the badge icon if earned, or an empty placeholder.
function BadgePreviewTile({ iconSrc }: { iconSrc?: string }) {
  return (
    <div
      className="flex h-[65px] w-[66.2px] items-center justify-center overflow-hidden rounded-[10px]"
      style={{ backgroundColor: iconSrc ? "#FFB411" : "#FFE9B8" }}
    >
      {iconSrc && (
        <img src={iconSrc} alt="" width={38} height={46} className="block select-none" draggable={false} />
      )}
    </div>
  );
}

// ─── Settings row ─────────────────────────────────────────────────────────────
function SettingsRow({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[20px] w-full items-center gap-[8px] border-none bg-transparent p-0 text-left transition active:opacity-60"
    >
      <span className="text-[18px] leading-none">{icon}</span>
      <span className="text-[15px] font-bold leading-[20px] text-[#2a2a2a]">{label}</span>
    </button>
  );
}

// ─── All instruction images (5 total) ─────────────────────────────────────────
const LEGO_ITEMS = [
  { id: "bamboo", img: bambooBuildImg, name: "Bamboo Build" },
  { id: "flower", img: flowerBuildImg, name: "Flower Build" },
  { id: "img1",   img: instructionImg1, name: "Botanicals I" },
  { id: "img2",   img: instructionImg2, name: "Botanicals II" },
  { id: "img3",   img: instructionImg3, name: "Roses" },
];

// ─── Edit Profile popup ───────────────────────────────────────────────────────
function EditProfilePopup({
  initialOwner,
  initialCompanion,
  onSave,
  onCancel,
}: {
  initialOwner: string;
  initialCompanion: string;
  onSave: (owner: string, companion: string) => void;
  onCancel: () => void;
}) {
  const [owner, setOwner] = useState(initialOwner);
  const [companion, setCompanion] = useState(initialCompanion);
  const ownerRef = useRef<HTMLInputElement>(null);

  useEffect(() => { ownerRef.current?.focus(); }, []);

  function handleSave() {
    const o = owner.trim() || initialOwner;
    const c = companion.trim() || initialCompanion;
    onSave(o, c);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* Card */}
      <div className="mx-[24px] w-full max-w-[360px] rounded-[20px] bg-[#FFFBF0] px-[24px] py-[28px] shadow-xl">
        <h2 className="text-[22px] font-extrabold leading-[30px] text-[#2a2a2a]">Edit Profile</h2>
        <p className="mt-[4px] text-[15px] font-bold text-[#949494]">Update your names below</p>

        <div className="mt-[24px] flex flex-col gap-[16px]">
          {/* Owner name */}
          <div>
            <label className="mb-[8px] block text-[15px] font-extrabold text-[#2a2a2a]">Owner Name</label>
            <input
              ref={ownerRef}
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              maxLength={32}
              placeholder="Your name"
              className="h-[50px] w-full rounded-[12px] border-none bg-[#FFE9B8] px-[16px] text-[16px] font-extrabold text-[#2a2a2a] outline-none placeholder:text-[#b0a080]"
            />
          </div>

          {/* Companion name */}
          <div>
            <label className="mb-[8px] block text-[15px] font-extrabold text-[#2a2a2a]">Companion Name</label>
            <input
              type="text"
              value={companion}
              onChange={(e) => setCompanion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              maxLength={16}
              placeholder="Companion name"
              className="h-[50px] w-full rounded-[12px] border-none bg-[#FFE9B8] px-[16px] text-[16px] font-extrabold text-[#2a2a2a] outline-none placeholder:text-[#b0a080]"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-[24px] flex gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] border-[2px] border-[#FFB411] bg-transparent text-[16px] font-extrabold text-[#2a2a2a] transition active:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#FFB411] text-[16px] font-extrabold text-[#2a2a2a] transition active:scale-[0.97] active:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = {
  name: string;
  username: string;
  companionName: string;
  finishedTasks: number;
  dayStreak: number;
  onBack: () => void;
  onSaveProfile: (ownerName: string, companionName: string) => void;
  onSeeBadges: () => void;
  onSeeLego: () => void;
};

// ─── Main screen ──────────────────────────────────────────────────────────────
export function ProfileScreen({
  name, username, companionName, finishedTasks, dayStreak,
  onBack, onSaveProfile, onSeeBadges, onSeeLego,
}: Props) {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<Set<string>>(() => loadBadgeSelection());
  const [friendsMade, setFriendsMade] = useState(6);
  const [statCardColor, setStatCardColor] = useState(() => lightenHex(getCompanionBodyColor(), 60));

  // Re-read badge + friend counts, badge selection, and companion color
  useEffect(() => {
    function refresh() {
      const sel = loadBadgeSelection();
      setSelectedBadgeIds(sel);
      setBadgeCount(sel.size);
      try {
        const fm = localStorage.getItem("profile.friendsMade");
        if (fm) setFriendsMade(Number(fm));
      } catch { /* ignore */ }
      setStatCardColor(lightenHex(getCompanionBodyColor(), 60));
    }
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === BADGE_SELECTION_KEY || e.key === "meepiCustomization.v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    const id = window.setInterval(refresh, 800);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(id);
    };
  }, []);

  // Show first 4 in the profile 2×2 grid
  const visibleLego = LEGO_ITEMS.slice(0, 4);

  return (
    <div
      className="relative mx-auto w-full max-w-[402px] overflow-y-auto bg-app-bg pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)]"
      style={{ minHeight: "100dvh" }}
    >
      {showEditPopup && (
        <EditProfilePopup
          initialOwner={name}
          initialCompanion={companionName}
          onSave={(o, c) => { onSaveProfile(o, c); setShowEditPopup(false); }}
          onCancel={() => setShowEditPopup(false)}
        />
      )}
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-[15px] top-[64px] flex h-[31px] w-[74px] items-center rounded-full bg-[#FFB411] shadow-sm"
        aria-label="Back"
      >
        <img src={backIcon} alt="" width={8} height={16} className="absolute left-[12px] top-[7.5px] block" draggable={false} aria-hidden />
        <span className="absolute left-[25px] top-[4px] text-[15px] font-extrabold leading-[23px] text-[#2a2a2a]">Back</span>
      </button>

      <div className="px-[15px] pt-[115px]">
        {/* ── Profile card (Frame 758531076) ── */}
        <div className="w-full rounded-[16px] bg-[#FFE9B8] px-[12px] py-[13px]">

          {/* Avatar row */}
          <div className="flex items-center gap-[8px]">
            {/* Profile face — circle face icon matching companion customization */}
            <MeepiFaceIcon size={72} className="shrink-0 rounded-full overflow-hidden" />

            {/* Name + username */}
            <div className="ml-[8px]">
              <p className="text-[24px] font-extrabold leading-[35px] text-[#2a2a2a]">{name}</p>
              <p className="text-[15px] font-bold leading-[23px] text-[#949494]">{username}</p>
            </div>
          </div>

          {/* Stats grid — background color derived from companion body color */}
          <div className="mt-[12px] grid grid-cols-2 gap-x-[16px] gap-y-[6px]">
            <StatCard value={friendsMade} label="Friends Made" color={statCardColor} />
            <StatCard value={dayStreak}   label="Day Streak"   color={statCardColor} />
            <StatCard value={finishedTasks} label="Finished Tasks" color={statCardColor} />
            <StatCard value={badgeCount}  label="Badges"       color={statCardColor} />
          </div>
        </div>

        {/* ── Badge Collection ── */}
        <div className="mt-[24px] flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold leading-[35px] text-[#2a2a2a]">Badge Collection</h2>
          <button type="button" onClick={onSeeBadges} className="flex items-center gap-[4px] text-[15px] font-bold text-[#949494] transition active:opacity-60">
            <span>See all</span>
            <span className="text-[16px]">→</span>
          </button>
        </div>

        {/* 2 rows × 5 — earned badges first, then empty placeholders */}
        {(() => {
          // Build 10 slots: fill with earned badges in order, pad with undefined
          const earned = ALL_BADGES.filter((b) => selectedBadgeIds.has(b.id));
          const slots = Array.from({ length: 10 }, (_, i) => earned[i]?.icon);
          const row1 = slots.slice(0, 5);
          const row2 = slots.slice(5, 10);
          return (
            <div className="mt-[8px] flex flex-col gap-[8px]">
              <div className="flex gap-[4.5px]">
                {row1.map((icon, i) => <BadgePreviewTile key={i} iconSrc={icon} />)}
              </div>
              <div className="flex gap-[4.5px]">
                {row2.map((icon, i) => <BadgePreviewTile key={i} iconSrc={icon} />)}
              </div>
            </div>
          );
        })()}

        {/* ── Lego Instruction Collection ── */}
        <div className="mt-[36px] flex items-center justify-between">
          <h2 className="text-[22px] font-extrabold leading-[35px] text-[#2a2a2a]">Lego Instruction Collection</h2>
          <button type="button" onClick={onSeeLego} className="flex shrink-0 items-center gap-[4px] text-[15px] font-bold text-[#949494] transition active:opacity-60">
            <span>See all</span>
            <span className="text-[16px]">→</span>
          </button>
        </div>

        {/* 2×2 grid — first 4 images */}
        <div className="mt-[10px] grid grid-cols-2 gap-[7px]">
          {visibleLego.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[10px] border-[2px] border-[#FFE9B8]">
              <img src={item.img} alt={item.name} className="h-[113px] w-full object-cover" draggable={false} />
            </div>
          ))}
        </div>

        {/* ── Settings ── */}
        <div className="mt-[36px] flex flex-col gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[16px] font-extrabold text-[#2a2a2a]">Settings</span>
            <span className="text-[18px]">⚙️</span>
          </div>
          <div className="flex flex-col gap-[12px]">
            <SettingsRow icon="👤" label="Edit Profile" onClick={() => setShowEditPopup(true)} />
            <SettingsRow icon="🔒" label="Privacy Policy" />
            <SettingsRow icon="📄" label="Terms of Service" />
            <SettingsRow icon="❓" label="Support" />
          </div>
        </div>

        {/* ── Sign Out ── */}
        <button
          type="button"
          className="mt-[28px] flex h-[29px] items-center gap-[8px] rounded-[6px] bg-[#FFE9B8] px-[8px] transition active:opacity-70"
        >
          <span className="text-[15px] font-extrabold leading-[21px] text-[#2a2a2a]">Sign Out</span>
          <span className="text-[16px]">→</span>
        </button>
      </div>
    </div>
  );
}
