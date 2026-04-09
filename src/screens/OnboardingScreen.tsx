import { type CSSProperties, useEffect, useRef, useState } from "react";
import { MeepiCharacter } from "../components/MeepiAvatar";
import { MeepiFaceIcon } from "../components/MeepiFaceIcon";

// ─── localStorage keys ────────────────────────────────────────────────────────
const ONBOARDING_KEY = "app.onboardingComplete";
const COMPANION_NAME_KEY = "companion.name";

export function getCompanionName(): string {
  return localStorage.getItem(COMPANION_NAME_KEY) || "Meepi";
}

export function setCompanionName(name: string) {
  localStorage.setItem(COMPANION_NAME_KEY, name);
}

// ─── Unlocked features (set when onboarding customization finishes) ────────────
export const UNLOCKED_FEATURES_KEY = "companion.unlocked.v1";

export type UnlockedFeatures = {
  eyes: number[];
  mouth: number[];
  eyebrow: number[];
  decoration: number[];
};

/** Returns the options the user unlocked during onboarding. Falls back to first slot only. */
export function loadUnlockedFeatures(): UnlockedFeatures {
  try {
    const raw = localStorage.getItem(UNLOCKED_FEATURES_KEY);
    if (raw) return JSON.parse(raw) as UnlockedFeatures;
  } catch { /* */ }
  return { eyes: [0], mouth: [0], eyebrow: [0], decoration: [0] };
}

export function saveUnlockedFeatures(eyes: number, mouth: number, eyebrow: number, decoration: number) {
  const data: UnlockedFeatures = {
    eyes: [eyes],
    mouth: [mouth],
    eyebrow: [eyebrow],
    decoration: decoration === 0 ? [0] : [0, decoration],
  };
  localStorage.setItem(UNLOCKED_FEATURES_KEY, JSON.stringify(data));
}

/** Appends a single option to the existing unlocked set for a given tab. */
export function addUnlockedFeature(tab: keyof UnlockedFeatures, index: number) {
  const data = loadUnlockedFeatures();
  if (!data[tab].includes(index)) data[tab].push(index);
  localStorage.setItem(UNLOCKED_FEATURES_KEY, JSON.stringify(data));
}

// ─── XP / Level system ─────────────────────────────────────────────────────────
const XP_KEY = "progress.xp";
/** Base increment — each level n requires n×50 XP to complete (level 1=50, level 2=100, …) */
export const XP_BASE = 50;

export function getXpCapForLevel(level: number): number {
  return level * XP_BASE; // level 1→50, level 2→100, level 3→150, …
}

/** Single-pass: returns level, xpInLevel, and xpCap together to avoid duplicate loop traversal. */
export function getLevelInfo(xp: number): { level: number; xpInLevel: number; xpCap: number } {
  let level = 1;
  let threshold = 0;
  while (xp >= threshold + getXpCapForLevel(level)) {
    threshold += getXpCapForLevel(level);
    level++;
  }
  return { level, xpInLevel: xp - threshold, xpCap: getXpCapForLevel(level) };
}

/** Convenience wrappers — prefer getLevelInfo() when you need multiple values. */
export function getLevelFromXp(xp: number): number { return getLevelInfo(xp).level; }
export function getXpInLevel(xp: number): number { return getLevelInfo(xp).xpInLevel; }

export function loadXp(): number {
  const raw = localStorage.getItem(XP_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}
export function saveXp(xp: number) { localStorage.setItem(XP_KEY, String(xp)); }
export function addXp(amount: number) { saveXp(loadXp() + amount); }
export function removeXp(amount: number) { saveXp(Math.max(0, loadXp() - amount)); }

// ─── Types ────────────────────────────────────────────────────────────────────
type OnboardingStep =
  | "q1" | "q2" | "q3" | "q4" | "q5"
  | "customize"
  | "final";

type Props = {
  onComplete: () => void;
};

// ─── Shared option-button selected-state style ───────────────────────────────
function optionStyle(selected: boolean): CSSProperties {
  return {
    backgroundColor: selected ? "#FFB411" : "#FFE9B8",
    border: selected ? "2px solid #FFB411" : "2px solid transparent",
  };
}

// ─── Progress bar dots ────────────────────────────────────────────────────────
const TOTAL_DOTS = 5;

function ProgressDots({ filled }: { filled: number }) {
  return (
    <div className="flex items-center gap-[8px] pt-[80px]" style={{ justifyContent: "center" }}>
      {Array.from({ length: TOTAL_DOTS }, (_, i) => (
        <div
          key={i}
          className="h-[8px] w-[40px] rounded-full transition-colors duration-300"
          style={{ backgroundColor: i < filled ? "#FFB411" : "#FFE9B8" }}
        />
      ))}
    </div>
  );
}

// ─── Option button (text-only) ────────────────────────────────────────────────
function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[16px] px-[20px] py-[20px] text-left text-[16px] font-bold leading-[24px] text-[#2a2a2a] transition active:scale-[0.99]"
      style={optionStyle(selected)}
    >
      {label}
    </button>
  );
}

// ─── Option button with emoji (tall, centered) ───────────────────────────────
function EmojiOptionButton({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center rounded-[16px] px-[20px] py-[20px] text-center transition active:scale-[0.99]"
      style={optionStyle(selected)}
    >
      <span className="text-[32px]">{emoji}</span>
      <span className="mt-[6px] text-[16px] font-bold leading-[22px] text-[#2a2a2a]">{label}</span>
    </button>
  );
}

// ─── Icon option (with emoji left-aligned) ────────────────────────────────────
function IconOptionButton({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[12px] rounded-[16px] px-[24px] py-[22px] text-left transition active:scale-[0.99]"
      style={optionStyle(selected)}
    >
      <span className="text-[24px]">{emoji}</span>
      <span className="text-[16px] font-bold leading-[24px] text-[#2a2a2a]">{label}</span>
    </button>
  );
}

// ─── Grid tile for Q4 ─────────────────────────────────────────────────────────
function GridTile({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-[16px] px-[8px] py-[20px] text-center transition active:scale-[0.98]"
      style={optionStyle(selected)}
    >
      <span className="text-[28px]">{emoji}</span>
      <span className="mt-[8px] text-[14px] font-bold leading-[18px] text-[#2a2a2a]">{label}</span>
    </button>
  );
}

// ─── Next button ──────────────────────────────────────────────────────────────
function NextButton({ label, disabled, onClick }: { label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mb-[40px] mt-[36px] h-[66px] w-full rounded-[16px] text-[18px] font-extrabold leading-[35px] transition active:scale-[0.99]"
      style={{
        backgroundColor: disabled ? "#FFE9B8" : "#FFB411",
        color: disabled ? "#949494" : "#2a2a2a",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

import { AnimatePresence, motion } from "motion/react";
import {
  TILE, GAP,
  TileButton, EyesIcon, MouthIcon, EyebrowIcon, DecorationIcon, ColorSwatch,
} from "./customization/CompanionCustomizationScreen";

type TabKey = "eyes" | "mouth" | "eyebrow" | "decoration" | "color";
type CustState = { eyes: number; mouth: number; eyebrow: number; decoration: number; color: number; tab: TabKey };
type SelectedOptions = { eyes: number; mouth: number; eyebrow: number; decoration: number };

const CUSTOMIZATION_KEY = "meepiCustomization.v1";

const TAB_TILE_COUNT: Record<TabKey, number> = {
  eyes: 10, mouth: 10, eyebrow: 4, decoration: 6, color: 14,
};

const PROFILE_KEY = "profile.userInfo";

function loadOwnerName(): string {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return (JSON.parse(raw) as { name?: string }).name ?? "owner name";
  } catch { /* */ }
  return "owner name";
}

function saveOwnerName(name: string) {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    const prev = raw ? (JSON.parse(raw) as { name?: string; username?: string }) : {};
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...prev, name }));
  } catch { /* */ }
}


function OnboardingCustomize({ companionName, onNameChange, onDone }: {
  companionName: string;
  onNameChange: (n: string) => void;
  onDone: (selected: SelectedOptions) => void;
}) {
  const [state, setState] = useState<CustState>({ eyes: 0, mouth: 0, eyebrow: 0, decoration: 0, color: 12, tab: "eyes" });
  const [editing, setEditing] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const [ownerName, setOwnerName] = useState(loadOwnerName);
  const [editingOwner, setEditingOwner] = useState(false);
  const ownerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { tab: _, ...rest } = state;
    try { localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(rest)); } catch { /* */ }
  }, [state]);

  useEffect(() => {
    if (editing && nameRef.current) nameRef.current.focus();
  }, [editing]);

  useEffect(() => {
    if (editingOwner && ownerRef.current) ownerRef.current.focus();
  }, [editingOwner]);

  function commitOwnerName(val: string) {
    const trimmed = val.trim() || "owner name";
    setOwnerName(trimmed);
    saveOwnerName(trimmed);
    setEditingOwner(false);
  }

  function commitCompanionName() {
    const trimmed = companionName.trim() || "Meepi";
    onNameChange(trimmed);
    setEditing(false);
  }

  const tabs: TabKey[] = ["eyes", "mouth", "eyebrow", "decoration", "color"];
  const tabLabels: Record<TabKey, string> = { eyes: "Eyes", mouth: "Mouth", eyebrow: "Eyebrow", decoration: "Decoration", color: "Color" };

  const selectedIndex = state.tab === "eyes" ? state.eyes : state.tab === "mouth" ? state.mouth : state.tab === "eyebrow" ? state.eyebrow : state.tab === "decoration" ? state.decoration : state.color;

  function setSelected(i: number) {
    const key = state.tab;
    if (key === "eyes") setState((s) => ({ ...s, eyes: i }));
    else if (key === "mouth") setState((s) => ({ ...s, mouth: i }));
    else if (key === "eyebrow") setState((s) => ({ ...s, eyebrow: i }));
    else if (key === "decoration") setState((s) => ({ ...s, decoration: i }));
    else setState((s) => ({ ...s, color: i }));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-app-bg">
      {/* Header — editable companion name, pencil icon */}
      <div className="flex items-center justify-center pt-[64px]">
        {editing ? (
          <div className="flex items-center gap-[8px]">
            <h1 className="text-[28px] font-extrabold leading-[36px] text-[#2a2a2a]">Customize</h1>
            <input
              ref={nameRef}
              className="w-[130px] border-0 border-b-2 border-[#FFB411] bg-transparent text-center text-[28px] font-extrabold leading-[49px] text-[#2a2a2a] outline-none"
              value={companionName}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={commitCompanionName}
              onKeyDown={(e) => { if (e.key === "Enter") commitCompanionName(); }}
              maxLength={16}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-[8px] border-0 bg-transparent p-0"
          >
            <h1 className="text-[28px] font-extrabold leading-[36px] text-[#2a2a2a]">
              Customize {companionName}
            </h1>
            <span className="text-[22px]">✏️</span>
          </button>
        )}
      </div>

      {/* Preview area */}
      <div className="relative mx-[23px] mt-[20px] rounded-[16px] bg-[#FFE9B8] px-[20px] py-[20px]">
        {/* Owner Name — top left */}
        <div className="mb-[12px]">
          <p className="text-[15px] font-bold uppercase tracking-wide text-[#949494]">Owner Name</p>
          {editingOwner ? (
            <input
              ref={ownerRef}
              className="mt-[2px] w-[140px] border-0 border-b-2 border-[#FFB411] bg-transparent text-[16px] font-extrabold text-[#2a2a2a] outline-none"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              onBlur={() => commitOwnerName(ownerName)}
              onKeyDown={(e) => { if (e.key === "Enter") commitOwnerName(ownerName); }}
              maxLength={24}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingOwner(true)}
              className="mt-[2px] flex items-center gap-[4px] border-0 bg-transparent p-0"
            >
              <span className="text-[16px] font-extrabold text-[#2a2a2a]">{ownerName}</span>
              <span className="text-[15px]">✏️</span>
            </button>
          )}
        </div>

        {/* Companion avatar — centered, always shows current onboarding state */}
        <div className="flex flex-col items-center pb-[12px]">
          <div style={{ width: 167, height: 146 }}>
            <MeepiCharacter state={{ eyes: state.eyes, mouth: state.mouth, eyebrow: state.eyebrow, decoration: state.decoration, color: state.color }} />
          </div>
          <p className="mt-[10px] text-[20px] font-extrabold leading-[29px] text-[#2a2a2a]">{companionName}</p>
          <p className="mt-[2px] text-[15px] font-bold leading-[21px] text-[#949494]">Lvl. 1</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="no-scrollbar mt-[20px] flex gap-[8px] overflow-x-auto px-[20px]">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setState((s) => ({ ...s, tab: t }))}
            className="shrink-0 rounded-[6px] px-[12px] py-[10px] text-[15px] font-extrabold leading-[24px] transition"
            style={{
              backgroundColor: state.tab === t ? "#FFB411" : "#FFE1A0",
              color: "#2a2a2a",
            }}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Tile grid */}
      <div className="mt-[16px] overflow-x-auto px-[20px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="grid"
            style={{ gridTemplateColumns: `repeat(4, ${TILE}px)`, gap: GAP }}
          >
            {Array.from({ length: TAB_TILE_COUNT[state.tab] }, (_, i) => {
              const sel = selectedIndex === i;
              const handleSelect = () => setSelected(i);
              if (state.tab === "color") {
                return <ColorSwatch key={i} idx={i} selected={sel} onClick={handleSelect} />;
              }
              return (
                <TileButton key={i} selected={sel} locked={false} onClick={handleSelect}>
                  {state.tab === "eyes" ? <EyesIcon variant={i} />
                    : state.tab === "mouth" ? <MouthIcon variant={i} />
                    : state.tab === "eyebrow" ? <EyebrowIcon variant={i} />
                    : <DecorationIcon variant={i} />}
                </TileButton>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Meepi button */}
      <div className="mt-auto px-[20px] pb-[40px] pt-[20px]">
        <button
          type="button"
          onClick={() => onDone({ eyes: state.eyes, mouth: state.mouth, eyebrow: state.eyebrow, decoration: state.decoration })}
          className="h-[66px] w-full rounded-[16px] bg-[#FFB411] text-[18px] font-extrabold leading-[35px] text-[#2a2a2a] transition active:scale-[0.99]"
        >
          Create {companionName} →
        </button>
      </div>
    </div>
  );
}

// ─── Final "Meet" screen ──────────────────────────────────────────────────────
function FinalScreen({ companionName, onGo }: { companionName: string; onGo: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-app-bg px-[20px]">
      <div className="mt-[148px]">
        <MeepiFaceIcon size={200} />
      </div>
      <h1 className="mt-[32px] text-center text-[36px] font-extrabold leading-[48px] text-[#2a2a2a]">
        Meet {companionName}! 👋
      </h1>
      <p className="mt-[16px] text-center text-[16px] font-bold leading-[24px] text-[#949494]">
        Your companion is ready. {companionName} will be with you every step of the way — celebrating your wins, checking in on you, and growing as you grow. Let's start your journey together.
      </p>
      <div className="mt-auto w-full pb-[60px] pt-[32px]">
        <button
          type="button"
          onClick={onGo}
          className="h-[70px] w-full rounded-[16px] bg-[#FFB411] text-[18px] font-extrabold leading-[35px] text-[#2a2a2a] transition active:scale-[0.99]"
        >
          Let's Go →
        </button>
      </div>
    </div>
  );
}

// ─── Main Onboarding Screen ───────────────────────────────────────────────────
export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState<OnboardingStep>("q1");
  const [q1, setQ1] = useState<number | null>(null);
  const [q2, setQ2] = useState<number | null>(null);
  const [q3, setQ3] = useState<number | null>(null);
  const [q4, setQ4] = useState<Set<number>>(new Set());
  const [q4Other, setQ4Other] = useState("");
  const [q5, setQ5] = useState<number | null>(null);
  const [companionName, setCompanionName] = useState("Meepi");

  function goNext() {
    if (step === "q1") setStep("q2");
    else if (step === "q2") setStep("q3");
    else if (step === "q3") setStep("q4");
    else if (step === "q4") setStep("q5");
    else if (step === "q5") setStep("customize");
  }

  function handleCustomizeDone(selected: SelectedOptions) {
    setCompanionName((n) => {
      const trimmed = n.trim() || "Meepi";
      localStorage.setItem(COMPANION_NAME_KEY, trimmed);
      return trimmed;
    });
    saveUnlockedFeatures(selected.eyes, selected.mouth, selected.eyebrow, selected.decoration);
    setStep("final");
  }

  function handleFinalGo() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  }

  const filledDots =
    step === "q1" ? 1 : step === "q2" ? 2 : step === "q3" ? 3 : step === "q4" ? 4 : step === "q5" ? 5 : 5;

  // ── Question screens ──
  if (step === "customize") {
    return (
      <div className="mx-auto w-full max-w-[402px]">
        <OnboardingCustomize
          companionName={companionName}
          onNameChange={setCompanionName}
          onDone={handleCustomizeDone}
        />
      </div>
    );
  }

  if (step === "final") {
    return (
      <div className="mx-auto w-full max-w-[402px]">
        <FinalScreen companionName={companionName} onGo={handleFinalGo} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-app-bg">
      <ProgressDots filled={filledDots} />

      {/* ── Q1 ── */}
      {step === "q1" && (
        <div className="flex flex-1 flex-col px-[20px]">
          <h1 className="mt-[48px] text-center text-[24px] font-extrabold leading-[33px] text-[#2a2a2a]">
            What brings you here today?
          </h1>
          <p className="mt-[24px] text-center text-[15px] font-bold leading-[23px] text-[#949494]">
            We'll personalize your experience.
          </p>
          <div className="mt-[28px] flex flex-col gap-[12px]">
            {["I need a little support right now", "I want to build better habits", "I'm feeling lonely and want connection", "Just exploring"].map((label, i) => (
              <OptionButton key={i} label={label} selected={q1 === i} onClick={() => setQ1(i)} />
            ))}
          </div>
          <NextButton label="Next →" disabled={q1 === null} onClick={goNext} />
        </div>
      )}

      {/* ── Q2 ── */}
      {step === "q2" && (
        <div className="flex flex-1 flex-col px-[20px]">
          <h1 className="mt-[32px] text-center text-[24px] font-extrabold leading-[33px] text-[#2a2a2a]">
            How are you feeling about your wellbeing lately?
          </h1>
          <div className="mt-[36px] flex flex-col gap-[16px]">
            <EmojiOptionButton emoji="😔" label="Struggling a bit" selected={q2 === 0} onClick={() => setQ2(0)} />
            <EmojiOptionButton emoji="😐" label="It's okay, but could be better" selected={q2 === 1} onClick={() => setQ2(1)} />
            <EmojiOptionButton emoji="😊" label="Pretty good — I want to maintain it" selected={q2 === 2} onClick={() => setQ2(2)} />
          </div>
          <NextButton label="Next →" disabled={q2 === null} onClick={goNext} />
        </div>
      )}

      {/* ── Q3 ── */}
      {step === "q3" && (
        <div className="flex flex-1 flex-col px-[20px]">
          <h1 className="mt-[48px] text-center text-[24px] font-extrabold leading-[33px] text-[#2a2a2a]">
            How much time can you realistically give yourself each day?
          </h1>
          <div className="mt-[36px] flex flex-col gap-[12px]">
            {["Just a few minutes", "Around 10–15 minutes", "30 minutes or more"].map((label, i) => (
              <OptionButton key={i} label={label} selected={q3 === i} onClick={() => setQ3(i)} />
            ))}
          </div>
          <NextButton label="Next →" disabled={q3 === null} onClick={goNext} />
        </div>
      )}

      {/* ── Q4: Select as many ── */}
      {step === "q4" && (
        <div className="flex flex-1 flex-col px-[20px]">
          <h1 className="mt-[32px] text-center text-[24px] font-extrabold leading-[33px] text-[#2a2a2a]">
            What does self-care mean to you right now?
          </h1>
          <p className="mt-[8px] text-center text-[15px] font-bold leading-[21px] text-[#949494]">
            Select as many as you like.
          </p>
          <div className="mt-[20px] grid grid-cols-2 gap-[12px]">
            {[
              { emoji: "🛏️", label: "Rest & recovery" },
              { emoji: "🏃", label: "Moving my body" },
              { emoji: "🤝", label: "Connecting with\nothers" },
              { emoji: "🧘", label: "Quieting my mind" },
            ].map((item, i) => (
              <GridTile
                key={i}
                emoji={item.emoji}
                label={item.label}
                selected={q4.has(i)}
                onClick={() =>
                  setQ4((cur) => {
                    const next = new Set(cur);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
              />
            ))}
          </div>
          <div className="mt-[12px] flex flex-col gap-[12px]">
            <GridTile
              emoji="📊"
              label="Tracking how I feel"
              selected={q4.has(4)}
              onClick={() =>
                setQ4((cur) => {
                  const next = new Set(cur);
                  if (next.has(4)) next.delete(4);
                  else next.add(4);
                  return next;
                })
              }
            />
            {/* Other option */}
            <button
              type="button"
              onClick={() =>
                setQ4((cur) => {
                  const next = new Set(cur);
                  if (next.has(5)) { next.delete(5); setQ4Other(""); }
                  else next.add(5);
                  return next;
                })
              }
              className="flex w-full items-center gap-[12px] rounded-[16px] px-[24px] py-[18px] text-left transition active:scale-[0.99]"
              style={optionStyle(q4.has(5))}
            >
              <span className="text-[24px]">✍️</span>
              <span className="text-[16px] font-bold leading-[24px] text-[#2a2a2a]">Other</span>
            </button>
            {q4.has(5) && (
              <textarea
                autoFocus
                value={q4Other}
                onChange={(e) => setQ4Other(e.target.value)}
                placeholder="Tell us more…"
                rows={3}
                className="w-full resize-none rounded-[14px] border-2 border-[#FFB411] bg-[#FFF8E1] px-[16px] py-[14px] text-[15px] font-bold leading-[22px] text-[#2a2a2a] outline-none placeholder:text-[#bbb]"
              />
            )}
          </div>
          <NextButton
            label="Next →"
            disabled={q4.size === 0}
            onClick={goNext}
          />
        </div>
      )}

      {/* ── Q5 ── */}
      {step === "q5" && (
        <div className="flex flex-1 flex-col px-[20px]">
          <h1 className="mt-[48px] text-center text-[24px] font-extrabold leading-[33px] text-[#2a2a2a]">
            How do you prefer to be supported?
          </h1>
          <div className="mt-[36px] flex flex-col gap-[12px]">
            <IconOptionButton emoji="🌿" label="Gentle nudges — don't push me" selected={q5 === 0} onClick={() => setQ5(0)} />
            <IconOptionButton emoji="🔔" label="Keep me accountable" selected={q5 === 1} onClick={() => setQ5(1)} />
            <IconOptionButton emoji="🤍" label="Just be there when I need it" selected={q5 === 2} onClick={() => setQ5(2)} />
          </div>
          <NextButton label={`Meet your ${companionName} →`} disabled={q5 === null} onClick={goNext} />
        </div>
      )}
    </div>
  );
}
