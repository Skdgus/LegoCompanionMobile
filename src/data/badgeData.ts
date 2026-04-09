/**
 * Shared badge definitions used by DeedScreen, BadgeCollectionScreen, and ProfileScreen.
 * Each badge maps to one of the 12 provided badge SVG icons.
 */

import badgeSleepChampion  from "../../assets/badge-sleep-champion.svg";
import badgeSprouting      from "../../assets/badge-sprouting.svg";
import badgeStepMaster     from "../../assets/badge-step-master.svg";
import badgeStreakMaster   from "../../assets/badge-streak-master.svg";
import badgeWaterTank      from "../../assets/badge-water-tank.svg";
import badgeWeeklyWarrior  from "../../assets/badge-weekly-warrior.svg";
import badgeDeepBreather   from "../../assets/badge-deep-breather.svg";
import badgeEarlyBird      from "../../assets/badge-early-bird.svg";
import badgeFirstSteps     from "../../assets/badge-first-steps.svg";
import badgeFocusFlow      from "../../assets/badge-focus-flow.svg";
import badgeHydrationHero  from "../../assets/badge-hydration-hero.svg";
import badgeMindfulMoment  from "../../assets/badge-mindful-moment.svg";

export type BadgeDef = {
  id: string;
  title: string;
  subtitle: string;
  icon: string; // imported SVG url
  /** leaf reward (shown in top-right pill) — stable across sessions */
  leafReward: number;
  /** XP reward (shown in bottom-left pill) — stable across sessions */
  xpReward: number;
};

export const ALL_BADGES: BadgeDef[] = [
  { id: "sprouting",       title: "Sprouting",          subtitle: "Complete your\nfirst task",          icon: badgeSprouting,      leafReward: 12, xpReward: 80  },
  { id: "water-tank",      title: "Human\nWater Tank",  subtitle: "Drink water 3+\nconsecutive days",   icon: badgeWaterTank,      leafReward: 18, xpReward: 120 },
  { id: "early-bird",      title: "Early Bird",         subtitle: "Wake up before\n8am three times",    icon: badgeEarlyBird,      leafReward: 22, xpReward: 140 },
  { id: "first-steps",     title: "First Steps",        subtitle: "Complete your\nfirst 5 tasks",       icon: badgeFirstSteps,     leafReward: 15, xpReward: 100 },
  { id: "hydration-hero",  title: "Hydration\nHero",    subtitle: "Drink 8 glasses\nof water today",    icon: badgeHydrationHero,  leafReward: 20, xpReward: 130 },
  { id: "mindful-moment",  title: "Mindful Moment",     subtitle: "Complete a\nmeditation session",     icon: badgeMindfulMoment,  leafReward: 25, xpReward: 150 },
  { id: "deep-breather",   title: "Deep Breather",      subtitle: "Practice breathing\n5 days in a row",icon: badgeDeepBreather,   leafReward: 28, xpReward: 170 },
  { id: "focus-flow",      title: "Focus Flow",         subtitle: "Focus 25 min\nwithout distraction",  icon: badgeFocusFlow,      leafReward: 30, xpReward: 200 },
  { id: "step-master",     title: "Step Master",        subtitle: "Walk 10k steps\nin a day",           icon: badgeStepMaster,     leafReward: 35, xpReward: 220 },
  { id: "sleep-champion",  title: "Sleep Champion",     subtitle: "Sleep 7+ hours\n3 nights in a row",  icon: badgeSleepChampion,  leafReward: 32, xpReward: 210 },
  { id: "weekly-warrior",  title: "Weekly Warrior",     subtitle: "Complete all tasks\nfor a full week", icon: badgeWeeklyWarrior, leafReward: 45, xpReward: 280 },
  { id: "streak-master",   title: "Streak Master",      subtitle: "7-day task streak",                  icon: badgeStreakMaster,   leafReward: 50, xpReward: 320 },
];

/** localStorage keys */
export const BADGE_SELECTION_KEY = "profile.badgeSelection.v2";
export const BADGE_EARNINGS_KEY  = "profile.badgeEarnings";
export const SHOP_SPENT_KEY      = "profile.shopSpent";
export const TASK_EARNINGS_KEY   = "task.earnings";

/** Load which badge IDs are currently selected (empty by default — 0 earned). */
export function loadBadgeSelection(): Set<string> {
  try {
    const raw = localStorage.getItem(BADGE_SELECTION_KEY);
    if (!raw) return new Set<string>();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set<string>();
  }
}

/** Persist current badge selection and update "badge earnings" balance */
export function saveBadgeSelection(selectedIds: Set<string>) {
  try {
    localStorage.setItem(BADGE_SELECTION_KEY, JSON.stringify([...selectedIds]));
    const earnings = ALL_BADGES
      .filter((b) => selectedIds.has(b.id))
      .reduce((sum, b) => sum + b.leafReward, 0);
    localStorage.setItem(BADGE_EARNINGS_KEY, String(earnings));
    // Also write badge count for ProfileScreen
    localStorage.setItem("profile.badgeCount", String(selectedIds.size));
    // Notify same-tab listeners (storage event doesn't fire for own writes)
    window.dispatchEvent(new Event("badge-earnings-changed"));
  } catch { /* ignore */ }
}

/** Add leaves earned from completing a task to the running session total */
export function addTaskLeaves(amount: number) {
  try {
    const current = Number(localStorage.getItem(TASK_EARNINGS_KEY) ?? "0");
    localStorage.setItem(TASK_EARNINGS_KEY, String(current + amount));
    // Notify same-tab listeners immediately (storage event doesn't fire for own writes)
    window.dispatchEvent(new Event("task-earnings-changed"));
  } catch { /* ignore */ }
}

export function loadBadgeEarnings(): number {
  try {
    return Number(localStorage.getItem(BADGE_EARNINGS_KEY) ?? "0");
  } catch {
    return 0;
  }
}

export function loadShopSpent(): number {
  try {
    return Number(localStorage.getItem(SHOP_SPENT_KEY) ?? "0");
  } catch {
    return 0;
  }
}

/** Shop balance using live task leaves (same source as homepage) — instant when passed from App */
export function computeShopBalance(taskLeafEarnings: number): number {
  return Math.max(0, loadBadgeEarnings() + taskLeafEarnings - loadShopSpent());
}

/** Compute current shop balance = badgeEarnings + taskEarnings - shopSpent (localStorage task total) */
export function loadShopBalance(): number {
  try {
    const taskEarnings = Number(localStorage.getItem(TASK_EARNINGS_KEY) ?? "0");
    return computeShopBalance(taskEarnings);
  } catch {
    return 0;
  }
}

/** Record a shop purchase (adds to shopSpent) */
export function recordPurchase(cost: number) {
  try {
    const current = Number(localStorage.getItem(SHOP_SPENT_KEY) ?? "0");
    localStorage.setItem(SHOP_SPENT_KEY, String(current + cost));
  } catch { /* ignore */ }
}
