import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import profileIcon from "../assets/Person-Fill Streamline Bootstrap.svg";
import leafIcon from "../assets/tabler_leaf-filled.svg";
import iconWater from "../assets/mdi_water.svg";
import iconApple from "../assets/fluent_food-apple-24-filled.svg";
import iconExercise from "../assets/material-symbols_exercise.svg";
import iconThunder from "../assets/boxicons_thunder-filled.svg";
import iconPlus    from "../assets/uil_plus.svg";
import iconRefresh from "../assets/refresh.svg";
import { AddTaskSheet } from "./components/AddTaskSheet";
import { BottomNav } from "./components/BottomNav";
import { MeepiAvatar } from "./components/MeepiAvatar";
import { TaskCardRow, type TaskRowModel } from "./components/TaskCardRow";
import { StatTile, type StatConfig, STAT_W } from "./components/StatTile";
import { ProgressPanel } from "./components/ProgressPanel";
import { CompanionPalScreen } from "./screens/CompanionPalScreen";
import { CompanionCustomizationScreen } from "./screens/customization/CompanionCustomizationScreen";
import { DeedScreen } from "./screens/DeedScreen";
import { CommunityFriendsScreen } from "./screens/CommunityFriendsScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { EditProfileScreen } from "./screens/profile/EditProfileScreen";
import { BadgeCollectionScreen } from "./screens/profile/BadgeCollectionScreen";
import { LegoCollectionScreen } from "./screens/profile/LegoCollectionScreen";
import {
  OnboardingScreen,
  getCompanionName,
  setCompanionName,
  loadXp,
  addXp,
} from "./screens/OnboardingScreen";
import { computePct } from "./screens/CompanionPalScreen";
import { SplashScreen } from "./screens/SplashScreen";
import { addTaskLeaves, loadShopBalance } from "./data/badgeData";

/** Frame 758531141 — 362×365 */
const COMPANION_W = 362;
const COMPANION_H = 365;
/** Inner frame — 338×260 @ x=12 y=93 */
const INNER_W = 338;
const INNER_H = 260;
const CHARACTER_W = 203;
const CHARACTER_H = 176.953;
/** Stat row — y=188.607, h=71.393 */
const STAT_FRAME_TOP = 188.607;
const STAT_ROW_H = 71.392578125;
const STAT_GAP_FIRST = 87.5179443359375 - STAT_W; // → 12.07…

const CONTENT_PAD_X = 17;
const SECTION_GAP = 30;

// Stats are computed dynamically inside App; removed static const.

const TASK_POOL: Omit<TaskRowModel, "id" | "done">[] = [
  { title: "Eat Dinner",          xp: "+20 XP", xpValue: 20, leaf: "+25" },
  { title: "40 Min Walking",      xp: "+35 XP", xpValue: 35, leaf: "+40" },
  { title: "Sleep Before 2am",    xp: "+15 XP", xpValue: 15, leaf: "+20" },
  { title: "Brush Teeth",         xp: "+10 XP", xpValue: 10, leaf: "+15" },
  { title: "Take a Break",        xp: "+30 XP", xpValue: 30, leaf: "+35" },
  { title: "Drink 8 Glasses",     xp: "+15 XP", xpValue: 15, leaf: "+18" },
  { title: "10 Min Meditation",   xp: "+20 XP", xpValue: 20, leaf: "+25" },
  { title: "Eat Breakfast",       xp: "+15 XP", xpValue: 15, leaf: "+18" },
  { title: "Read for 20 Min",     xp: "+25 XP", xpValue: 25, leaf: "+30" },
  { title: "Stretch 10 Min",      xp: "+15 XP", xpValue: 15, leaf: "+18" },
  { title: "No Screen 1 hr",      xp: "+25 XP", xpValue: 25, leaf: "+30" },
  { title: "Cook a Meal",         xp: "+30 XP", xpValue: 30, leaf: "+35" },
  { title: "Take Vitamins",       xp: "+10 XP", xpValue: 10, leaf: "+12" },
  { title: "Bed by 11pm",         xp: "+20 XP", xpValue: 20, leaf: "+25" },
  { title: "30 Min Workout",      xp: "+40 XP", xpValue: 40, leaf: "+45" },
  { title: "Drink Green Tea",     xp: "+10 XP", xpValue: 10, leaf: "+12" },
  { title: "Journal Entry",       xp: "+20 XP", xpValue: 20, leaf: "+22" },
  { title: "Cold Shower",         xp: "+25 XP", xpValue: 25, leaf: "+28" },
  { title: "Eat Fruits Today",    xp: "+15 XP", xpValue: 15, leaf: "+18" },
  { title: "10k Steps",           xp: "+40 XP", xpValue: 40, leaf: "+45" },
];

function pickRandomTasks(): TaskRowModel[] {
  const shuffled = [...TASK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((t, i) => ({
    ...t,
    id: `t-${Date.now()}-${i}`,
    done: false,
  }));
}

const TASK_LIMIT = 10;

type AppScreen =
  | "home" | "customize" | "deed"
  | "shop" | "community" | "profile"
  | "edit-profile" | "badge-collection" | "lego-collection";

const PROFILE_KEY = "profile.userInfo";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as { name: string; username: string };
  } catch { /* ignore */ }
  return { name: "John", username: "@DoePzza" };
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [companionName, setCompanionNameState] = useState(() => getCompanionName());
  const [screen, setScreen] = useState<AppScreen>("home");
  // Lazy initializer → fresh random tasks on every browser page-refresh
  const [tasks, setTasks] = useState<TaskRowModel[]>(() => pickRandomTasks());
  // Cumulative count of tasks marked done this session (not persisted)
  const [totalDone, setTotalDone] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  // Single popup for both limit messages (null = hidden)
  const [limitMsg, setLimitMsg] = useState<string | null>(null);
  const [profile, setProfile] = useState(loadProfile);
  const [dayStreak] = useState(25);
  // XP is cleared from localStorage by main.tsx on every page load, so we
  // always start at 0. We still write to localStorage so addXp/removeXp work.
  const [xp, setXp] = useState(0);
  const [showPalModal, setShowPalModal] = useState(false);

  // Keep companion name in sync via storage event (fires instantly on change,
  // no idle polling cost — replaces the 800ms setInterval).
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "companion.name") setCompanionNameState(getCompanionName());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Re-read profile when onboarding finishes (owner name may have been set)
  useEffect(() => {
    if (onboarded) setProfile(loadProfile());
  }, [onboarded]);

  // Live spendable leaf balance: tasks earned + badge earned − shop spent
  const [liveBalance, setLiveBalance] = useState(() => loadShopBalance());
  const prevBalanceRef = useRef(liveBalance);
  const [balancePulse, setBalancePulse] = useState<"up" | "down" | "none">("none");

  useEffect(() => {
    const refresh = () => {
      const next = loadShopBalance();
      const prev = prevBalanceRef.current;
      if (next !== prev) {
        prevBalanceRef.current = next;
        setBalancePulse(next > prev ? "up" : "down");
        setLiveBalance(next);
      }
    };
    window.addEventListener("task-earnings-changed",  refresh);
    window.addEventListener("badge-earnings-changed", refresh);
    window.addEventListener("storage", refresh);
    const id = window.setInterval(refresh, 800);
    return () => {
      window.removeEventListener("task-earnings-changed",  refresh);
      window.removeEventListener("badge-earnings-changed", refresh);
      window.removeEventListener("storage", refresh);
      window.clearInterval(id);
    };
  }, []);

  const { doneCount, total } = useMemo(() => {
    const doneTasks = tasks.filter((t) => t.done);
    return {
      doneCount: doneTasks.length,
      total: tasks.length,
    };
  }, [tasks]);

  // Mirror the companion popup stat bars on the home screen
  const stats: StatConfig[] = useMemo(() => [
    { icon: iconWater,    alt: "Hydration", fill: "#2196f3", pct: computePct("Hydration", tasks) },
    { icon: iconApple,    alt: "Hunger",    fill: "#e53935", pct: computePct("Hunger",    tasks) },
    { icon: iconExercise, alt: "Exercise",  fill: "#212121", pct: computePct("Energy",    tasks) },
    { icon: iconThunder,  alt: "Energy",    fill: "#fffde7", pct: computePct("Mood",      tasks) },
  ], [tasks]);

  function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.done) return;
    const xpAmount   = task.xpValue ?? (parseInt(task.xp.replace(/\D/g, ""), 10) || 25);
    const leafAmount = parseInt((task.leaf ?? "0").replace(/\D/g, ""), 10) || 0;
    addXp(xpAmount);
    addTaskLeaves(leafAmount);
    setXp(loadXp());
    setTotalDone((n) => n + 1);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
  }

  function refreshTasks() {
    if (totalDone >= TASK_LIMIT) {
      setLimitMsg(`You've completed ${TASK_LIMIT} tasks today — great work! Come back tomorrow for a fresh set.`);
      return;
    }
    setTasks(pickRandomTasks());
  }

  function addTask(title: string) {
    if (totalDone >= TASK_LIMIT) {
      setLimitMsg(`You've reached the daily limit of ${TASK_LIMIT} completed tasks. Come back tomorrow!`);
      return;
    }
    const id = globalThis.crypto?.randomUUID?.() ?? `t-${Date.now()}`;
    setTasks((prev) => [
      ...prev,
      { id, title, done: false, xp: "+25 XP", leaf: "+30" },
    ]);
  }

  if (!onboarded && !splashDone) {
    return <SplashScreen onStart={() => setSplashDone(true)} />;
  }

  if (!onboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setOnboarded(true);
          setCompanionNameState(getCompanionName());
        }}
      />
    );
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[402px] bg-app-bg">
      {screen === "customize" ? (
        <CompanionCustomizationScreen onBack={() => { setScreen("home"); setShowPalModal(true); }} />
      ) : screen === "deed" ? (
        <DeedScreen />
      ) : screen === "community" ? (
        <CommunityFriendsScreen />
      ) : screen === "shop" ? (
        <ShopScreen />
      ) : screen === "profile" ? (
        <ProfileScreen
          name={profile.name}
          username={profile.username}
          companionName={companionName}
          finishedTasks={doneCount}
          dayStreak={dayStreak}
          onBack={() => setScreen("home")}
          onSaveProfile={(ownerName, compName) => {
            const updated = { name: ownerName, username: profile.username };
            setProfile(updated);
            try { localStorage.setItem(PROFILE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
            setCompanionName(compName);
            setCompanionNameState(compName);
          }}
          onSeeBadges={() => setScreen("badge-collection")}
          onSeeLego={() => setScreen("lego-collection")}
        />
      ) : screen === "edit-profile" ? (
        <EditProfileScreen
          name={profile.name}
          username={profile.username}
          onBack={() => setScreen("profile")}
          onSave={(name, username) => {
            const updated = { name, username };
            setProfile(updated);
            try { localStorage.setItem(PROFILE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
            setScreen("profile");
          }}
        />
      ) : screen === "badge-collection" ? (
        <BadgeCollectionScreen onBack={() => setScreen("profile")} />
      ) : screen === "lego-collection" ? (
        <LegoCollectionScreen onBack={() => setScreen("profile")} />
      ) : (
        <div
          className="pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)]"
          style={{ paddingLeft: CONTENT_PAD_X, paddingRight: CONTENT_PAD_X }}
        >
          <header className="flex items-center justify-between pt-[64px]">
            {/* Leaf currency pill — updates instantly when tasks done or badges earned/spent */}
            <div className="flex items-center gap-[6px] rounded-full bg-[#FFB411] px-[14px] py-[10px] shadow-sm">
              <img src={leafIcon} alt="Leaves" className="h-[22px] w-[22px]" />
              <motion.span
                className="text-[17px] font-extrabold leading-none tabular-nums text-[#2B2B2B]"
                animate={
                  balancePulse === "up"
                    ? { scale: [1, 1.15, 1] }
                    : balancePulse === "down"
                      ? { scale: [1, 0.88, 1] }
                      : { scale: 1 }
                }
                transition={{ duration: 0.35, times: [0, 0.35, 1], ease: "easeOut" }}
                onAnimationComplete={() => { if (balancePulse !== "none") setBalancePulse("none"); }}
              >
                {liveBalance}
              </motion.span>
            </div>

            {/* Profile button */}
            <button
              type="button"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-orange-primary transition hover:brightness-95 active:scale-[0.98]"
              aria-label="Profile"
              onClick={() => setScreen("profile")}
            >
              <img src={profileIcon} alt="" className="h-[30px] w-[30px]" />
            </button>
          </header>

          <section style={{ marginTop: SECTION_GAP }}>
            <h1 className="text-[24px] font-extrabold leading-[33px] text-text">
              Good morning, {profile.name}!
            </h1>
            <p className="mt-[12px] text-[15px] font-bold leading-[19px] text-text-muted">
              Your pal missed you!
            </p>
          </section>

          {/* Companion panel — Frame 758531141 */}
          <section style={{ marginTop: SECTION_GAP }}>
            <button
              type="button"
              className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              onClick={() => setShowPalModal(true)}
              aria-label="Open My Pal companion screen"
            >
              <div
                className="rounded-[20px] bg-companion-panel px-[12px] pb-[12px] pt-[12px] shadow-[0_1px_0_rgba(0,0,0,0.06)] transition hover:brightness-[1.015] active:scale-[0.997]"
                style={{ width: COMPANION_W, minHeight: COMPANION_H }}
              >
                <p className="text-[15px] font-bold leading-[19px] tracking-[0.02em] text-text">
                  My companion
                </p>
                <p className="mt-[8px] text-[18px] font-extrabold leading-[23px] text-text">
                  {companionName}
                </p>
                <p className="mt-[8px] text-[15px] font-semibold leading-[19px] text-text">
                  Feeling relaxed
                </p>

                <div className="relative mt-[8px]" style={{ width: INNER_W, height: INNER_H }}>
                  <div
                    className="absolute left-1/2 top-0 -translate-x-1/2"
                    style={{ width: CHARACTER_W, height: STAT_FRAME_TOP }}
                  >
                    <div className="flex h-full items-start justify-center pt-0">
                      <MeepiAvatar
                        width={CHARACTER_W}
                        height={CHARACTER_H}
                        className="block max-w-none"
                      />
                    </div>
                  </div>

                  <div
                    className="absolute left-0 flex items-end"
                    style={{
                      top: STAT_FRAME_TOP,
                      width: INNER_W,
                      height: STAT_ROW_H,
                      columnGap: STAT_GAP_FIRST,
                    }}
                  >
                    {stats.map((s) => (
                      <StatTile key={s.alt} {...s} />
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </section>

          <section style={{ marginTop: SECTION_GAP }}>
            <h2 className="text-[19px] font-extrabold leading-[23px] text-text">Progress</h2>
            <div className="mt-[8px] flex justify-center">
              <ProgressPanel xp={xp} onRewardClaimed={() => setXp(loadXp())} />
            </div>
          </section>

          <section
            className="flex h-[35px] items-center justify-between"
            style={{ marginTop: SECTION_GAP }}
          >
            <div className="flex h-[35px] items-center gap-[9px]">
              <h2 className="whitespace-nowrap text-[22px] font-extrabold leading-[35px] text-text">
                Today's Task
              </h2>
              <span className="flex h-[30px] min-w-[83px] items-center justify-center rounded-full bg-orange-primary px-[7px] text-[15px] font-extrabold leading-[24px] text-text">
                {doneCount}/{total} done
              </span>
              <button
                type="button"
                onClick={refreshTasks}
                disabled={totalDone >= TASK_LIMIT}
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-orange-primary transition hover:brightness-95 active:scale-95"
                aria-label="Refresh tasks"
                style={{
                  opacity: totalDone >= TASK_LIMIT ? 0.38 : 1,
                  cursor: totalDone >= TASK_LIMIT ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                <img src={iconRefresh} alt="" width={16} height={16} draggable={false} />
              </button>
            </div>
            <button
              type="button"
              disabled={totalDone >= TASK_LIMIT}
              onClick={() => {
                if (totalDone >= TASK_LIMIT) {
                  setLimitMsg(`You've reached the daily limit of ${TASK_LIMIT} completed tasks. Come back tomorrow!`);
                  return;
                }
                setAddOpen(true);
              }}
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-orange-primary transition hover:brightness-95 active:scale-95"
              aria-label="Add new task"
              style={{
                opacity: totalDone >= TASK_LIMIT ? 0.38 : 1,
                cursor: totalDone >= TASK_LIMIT ? "not-allowed" : "pointer",
                transition: "opacity 0.2s",
              }}
            >
              <img src={iconPlus} alt="" width={24} height={24} />
            </button>
          </section>

          <ul className="mt-[30px] flex list-none flex-col pb-1" style={{ gap: 8 }}>
            {tasks.map((t) => (
              <li key={t.id} className="flex justify-center">
                <TaskCardRow task={t} onToggle={toggleTask} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <BottomNav
        active={
          screen === "community"
            ? "community"
            : screen === "deed"
              ? "deed"
              : screen === "shop"
                ? "shop"
                : "home"
        }
        onNavigate={(id) => {
          if (id === "home")           setScreen("home");
          else if (id === "community") setScreen("community");
          else if (id === "deed")      setScreen("deed");
          else if (id === "shop")      setScreen("shop");
          else setScreen("home");
        }}
      />
      <AddTaskSheet open={addOpen} onClose={() => setAddOpen(false)} onAdd={addTask} />

      {/* ── Daily limit popup (task add & refresh) ── */}
      {limitMsg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-[24px]">
          <button
            type="button"
            className="absolute inset-0 bg-[#212121]/50"
            aria-label="Dismiss"
            onClick={() => setLimitMsg(null)}
          />
          <div className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-[24px] bg-[#fff6e6] px-[28px] py-[32px] shadow-xl text-center">
            <div className="mb-[12px] text-[36px]">🚫</div>
            <p className="text-[18px] font-extrabold leading-[26px] text-[#212121]">
              Daily Limit Reached
            </p>
            <p className="mt-[10px] text-[15px] font-semibold leading-[22px] text-[#555]">
              {limitMsg}
            </p>
            <button
              type="button"
              onClick={() => setLimitMsg(null)}
              className="mt-[24px] h-[50px] w-full rounded-[16px] bg-[#FFB411] text-[16px] font-extrabold text-[#212121] transition active:scale-[0.98]"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Companion Pal popup — bottom sheet ── */}
      {showPalModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-[#212121]/50"
            aria-label="Close companion screen"
            onClick={() => setShowPalModal(false)}
          />
          <div className="relative z-10 w-full max-w-[402px] overflow-y-auto rounded-t-[26px] shadow-2xl" style={{ maxHeight: "90dvh" }}>
            <CompanionPalScreen
              tasks={tasks}
              onCustomize={() => { setShowPalModal(false); setScreen("customize"); }}
              onClose={() => setShowPalModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
