import type { ReactNode } from "react";
import navHome      from "../../assets/House-Door-Fill Streamline Bootstrap.svg";
import navCommunity from "../../assets/community-tab-icon.svg";
import navDeed      from "../../assets/Trophy-Fill Streamline Bootstrap.svg";
import navShop      from "../../assets/Bag-Fill Streamline Bootstrap.svg";

type NavKey = "home" | "community" | "deed" | "shop";

const ICON = 26;

const items: { id: NavKey; label: string; icon: ReactNode }[] = [
  {
    id: "home",
    label: "HOME",
    icon: <img src={navHome} alt="" width={ICON} height={ICON} className="block" draggable={false} />,
  },
  {
    id: "community",
    label: "COMMUNITY",
    icon: <img src={navCommunity} alt="" width={ICON} height={ICON} className="block" draggable={false} />,
  },
  {
    id: "deed",
    label: "BADGES",
    icon: <img src={navDeed} alt="" width={ICON} height={ICON} className="block" draggable={false} />,
  },
  {
    id: "shop",
    label: "SHOP",
    icon: <img src={navShop} alt="" width={ICON} height={ICON} className="block" draggable={false} />,
  },
];

/** Component 9 — 402×87 */
export function BottomNav({
  active = "home",
  onNavigate,
}: {
  active?: NavKey;
  onNavigate?: (id: NavKey) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 flex h-[87px] w-full max-w-[402px] -translate-x-1/2 items-center justify-around border-t border-[#212121]/6 bg-app-bg px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]"
      aria-label="Main navigation"
    >
      {items.map(({ id, label, icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate?.(id)}
            className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1 transition-opacity ${
              isActive ? "opacity-100" : "opacity-55 hover:opacity-80"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-text">{icon}</span>
            <span className="text-[11px] font-extrabold leading-none tracking-wide text-text">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
