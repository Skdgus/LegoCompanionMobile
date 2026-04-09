import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Reset every session-based key on every page load so the app always
// starts fresh. Persistent user settings (customization, profile, companion
// name, onboarding flag, unlocked features, shop cosmetics) are intentionally
// NOT removed — only dynamic progress data is cleared.
const SESSION_KEYS = [
  "progress.xp",
  "progress.rewardsClaimed",
  "profile.friendsMade",
  "profile.badgeCount",
  "profile.badgeSelection.v2",  // actual key from badgeData.ts
  "profile.badgeEarnings",       // actual key from badgeData.ts
  "profile.shopSpent",           // actual key from badgeData.ts
  "task.earnings",
];
SESSION_KEYS.forEach((k) => localStorage.removeItem(k));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
