import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { loadShopBalance, recordPurchase } from "../data/badgeData";
import leafIcon from "../../assets/tabler_leaf-filled.svg";
import searchIcon from "../../assets/searchIcon.svg";
import bambooBuildImg from "../../assets/bamboo-build.png";
import flowerBuildImg from "../../assets/flower-build.png";
import blushTileSvg from "../../assets/Blush.svg";
import glassesTileSvg from "../../assets/Glasses.svg";
import bowTieTileSvg from "../../assets/BowTie.svg";
import sweatTileSvg from "../../assets/Sweat.svg";
import bandAidTileSvg from "../../assets/BandAid.svg";
import { unlockDecoration, getUnlockedDecorations } from "./customization/CompanionCustomizationScreen";

// ─── Leaf coin icon ────────────────────────────────────────────────────────────
function LeafCoin({ size = 20 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#FFB411]"
      style={{ width: size, height: size }}
    >
      <img src={leafIcon} alt="" width={size * 0.6} height={size * 0.6} className="block" draggable={false} />
    </span>
  );
}

/** Smoothly counts displayed balance to match the live shop value (ease-out). */
function useAnimatedBalance(target: number): number {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(display);
  displayRef.current = display;

  useEffect(() => {
    if (target === displayRef.current) return;
    let raf = 0;
    const start = displayRef.current;
    const delta = target - start;
    const duration = Math.min(750, 140 + Math.sqrt(Math.abs(delta)) * 28);
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - p) ** 3;
      const next = Math.round(start + delta * eased);
      setDisplay(next);
      if (p < 1) raf = requestAnimationFrame(step);
      else if (next !== target) setDisplay(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return display;
}

function ShopBalanceAmount({ value }: { value: number }) {
  const display = useAnimatedBalance(value);
  const prev = useRef(value);
  const [pulse, setPulse] = useState<"up" | "down" | "none">("none");

  useEffect(() => {
    const was = prev.current;
    if (value === was) return;
    prev.current = value;
    setPulse(value > was ? "up" : "down");
  }, [value]);

  return (
    <motion.span
      className="inline-block min-w-[2ch] text-[26px] font-extrabold leading-[38px] text-[#2a2a2a] tabular-nums"
      animate={
        pulse === "up"
          ? { scale: [1, 1.08, 1] }
          : pulse === "down"
            ? { scale: [1, 0.94, 1] }
            : { scale: 1 }
      }
      transition={{ duration: 0.38, times: [0, 0.35, 1], ease: "easeOut" }}
      onAnimationComplete={() => { if (pulse !== "none") setPulse("none"); }}
    >
      {display}
    </motion.span>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type ShopTab = "lego" | "cosmetics";

type LegoItem = {
  kind: "lego";
  id: string;
  name: string;
  detail1: string;
  detail2: string;
  cost: number;
  tag: string;
  img: string;
};

type CosmeticItem = {
  kind: "cosmetic";
  id: string;
  name: string;
  description: string;
  cost: number;
  tag: string;
  decorationIndex: number; // matches the decoration slot in customization (1–5)
  previewIcon: string;
};


const LEGO_ITEMS: LegoItem[] = [
  {
    kind: "lego",
    id: "bamboo",
    name: "Bamboo Build",
    detail1: "325pcs",
    detail2: "Medium",
    cost: 230,
    tag: "PDF",
    img: bambooBuildImg,
  },
  {
    kind: "lego",
    id: "flower",
    name: "Flower Build",
    detail1: "220pcs",
    detail2: "Easy",
    cost: 45,
    tag: "PDF",
    img: flowerBuildImg,
  },
];

const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    kind: "cosmetic",
    id: "deco-blush",
    name: "Blush",
    description: "Rosy cheeks for your pal",
    cost: 30,
    tag: "NEW",
    decorationIndex: 1,
    previewIcon: blushTileSvg,
  },
  {
    kind: "cosmetic",
    id: "deco-glasses",
    name: "Glasses",
    description: "Round scholar specs",
    cost: 50,
    tag: "HOT",
    decorationIndex: 2,
    previewIcon: glassesTileSvg,
  },
  {
    kind: "cosmetic",
    id: "deco-bowtie",
    name: "Bow Tie",
    description: "Fancy bow tie accessory",
    cost: 40,
    tag: "NEW",
    decorationIndex: 3,
    previewIcon: bowTieTileSvg,
  },
  {
    kind: "cosmetic",
    id: "deco-sweat",
    name: "Sweat Drop",
    description: "Expressive sweat bead",
    cost: 20,
    tag: "HOT",
    decorationIndex: 4,
    previewIcon: sweatTileSvg,
  },
  {
    kind: "cosmetic",
    id: "deco-bandaid",
    name: "Band-Aid",
    description: "Little courage badge",
    cost: 25,
    tag: "NEW",
    decorationIndex: 5,
    previewIcon: bandAidTileSvg,
  },
];

// ─── Lego card ─────────────────────────────────────────────────────────────────
function LegoCard({
  item,
  purchased,
  onPurchase,
}: {
  item: LegoItem;
  purchased: boolean;
  onPurchase: () => void;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[16px]" style={{ background: "#FFE9B8", minHeight: 207 }}>
      {/* tag pill */}
      <div className="absolute right-[12px] top-[12px] flex h-[26px] items-center rounded-full bg-[#FFB411] px-[10px]">
        <span className="text-[13px] font-extrabold leading-[24px] text-[#2a2a2a]">{item.tag}</span>
      </div>

      {/* product image */}
      <div className="absolute left-[11px] top-[41px] h-[125px] w-[166px] overflow-hidden rounded-[8px] bg-white">
        <img src={item.img} alt={item.name} className="h-full w-full object-cover" draggable={false} />
      </div>

      {/* right info */}
      <div className="absolute left-[185px] top-[41px]" style={{ width: 152 }}>
        <p className="text-[18px] font-extrabold leading-[25px] text-[#2a2a2a]">{item.name}</p>
        <div className="mt-[8px] flex items-center gap-[8px]">
          <span className="text-[14px] font-extrabold text-[#2a2a2a]">{item.detail1}</span>
          <span className="text-[14px] font-extrabold text-[#2a2a2a]">{item.detail2}</span>
        </div>

        <div className="mt-[41px] flex items-center gap-[6px]">
          <LeafCoin size={20} />
          <span className="text-[14px] font-extrabold leading-[21px] text-[#2a2a2a]">{item.cost}</span>
        </div>

        <button
          type="button"
          onClick={onPurchase}
          disabled={purchased}
          className="mt-[8px] flex h-[31px] w-full items-center justify-center rounded-full transition active:scale-[0.97]"
          style={{ background: purchased ? "#d9d9d9" : "#FFB411", cursor: purchased ? "default" : "pointer" }}
        >
          <span className="text-[14px] font-extrabold text-[#2a2a2a]">{purchased ? "Purchased" : "Purchase"}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Cosmetic card ─────────────────────────────────────────────────────────────
function CosmeticCard({
  item,
  purchased,
  onPurchase,
}: {
  item: CosmeticItem;
  purchased: boolean;
  onPurchase: () => void;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[16px]" style={{ background: "#FFE9B8", minHeight: 207 }}>
      {/* tag pill */}
      <div className="absolute right-[12px] top-[12px] flex h-[26px] items-center rounded-full bg-[#FFB411] px-[10px]">
        <span className="text-[13px] font-extrabold leading-[24px] text-[#2a2a2a]">{item.tag}</span>
      </div>

      {/* decoration preview */}
      <div className="absolute left-[11px] top-[41px] flex h-[125px] w-[166px] items-center justify-center rounded-[8px] bg-[#FFF7E7]">
        <img src={item.previewIcon} alt={item.name} className="h-[80px] w-[80px] object-contain" draggable={false} />
      </div>

      {/* right info */}
      <div className="absolute left-[185px] top-[41px]" style={{ width: 152 }}>
        <p className="text-[18px] font-extrabold leading-[25px] text-[#2a2a2a]">{item.name}</p>
        <p className="mt-[6px] text-[12px] font-bold leading-[16px] text-[#949494]">{item.description}</p>

        <div className="mt-[30px] flex items-center gap-[6px]">
          <LeafCoin size={20} />
          <span className="text-[14px] font-extrabold leading-[21px] text-[#2a2a2a]">{item.cost}</span>
        </div>

        <button
          type="button"
          onClick={onPurchase}
          disabled={purchased}
          className="mt-[8px] flex h-[31px] w-full items-center justify-center rounded-full transition active:scale-[0.97]"
          style={{ background: purchased ? "#d9d9d9" : "#FFB411", cursor: purchased ? "default" : "pointer" }}
        >
          <span className="text-[14px] font-extrabold text-[#2a2a2a]">
            {purchased ? "Unlocked ✓" : "Purchase"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function ShopScreen() {
  /** Recomputed from localStorage whenever tasks or badges change */
  const [balance, setBalance] = useState(() => loadShopBalance());
  const [purchasedLegoIds, setPurchasedLegoIds] = useState<Set<string>>(new Set(["bamboo"]));
  // Mirror localStorage so re-renders pick up the right set
  const [unlockedDecos, setUnlockedDecos] = useState<Set<number>>(() => getUnlockedDecorations());
  const [activeTab, setActiveTab] = useState<ShopTab>("lego");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Re-sync balance instantly from both task completions, badge selections, and shop purchases
  useEffect(() => {
    const refresh = () => setBalance(loadShopBalance());
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

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleLegoPurchase(item: LegoItem) {
    if (purchasedLegoIds.has(item.id)) return;
    const live = loadShopBalance();
    if (live < item.cost) { showToast("Not enough points"); return; }
    recordPurchase(item.cost);
    setBalance(loadShopBalance());
    setPurchasedLegoIds((prev) => new Set([...prev, item.id]));
  }

  function handleCosmeticPurchase(item: CosmeticItem) {
    if (unlockedDecos.has(item.decorationIndex)) return;
    const live = loadShopBalance();
    if (live < item.cost) { showToast("Not enough points"); return; }
    recordPurchase(item.cost);
    setBalance(loadShopBalance());
    unlockDecoration(item.decorationIndex);
    setUnlockedDecos(getUnlockedDecorations());
    showToast(`${item.name} unlocked in Customization!`);
  }

  const visibleLego = LEGO_ITEMS.filter(
    (i) => search === "" || i.name.toLowerCase().includes(search.toLowerCase()),
  );
  const visibleCosmetics = COSMETIC_ITEMS.filter(
    (i) => search === "" || i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="relative w-full overflow-y-auto pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)]"
      style={{ background: "#FFFBF2", minHeight: "100dvh" }}
    >
      {/* ── Header (Frame 758531108) ── */}
      <div className="px-[15px] pt-[64px]">
        <div className="mb-[10px]">
          <h1 className="text-[36px] font-extrabold leading-[50px] text-[#2a2a2a]">Shop</h1>
          <p className="text-[15px] font-bold leading-[23px] text-[#949494]">
            purchase with your earned leaves
          </p>
        </div>

        <div
          className="mt-[10px] h-[131px] w-full rounded-[20px] px-[12px] pt-[19px]"
          style={{ background: "#FFE9B8" }}
          data-figma-group="group183"
        >
          <p className="ml-[5px] text-[20px] font-extrabold leading-[29px] text-[#2a2a2a]">YOUR BALANCE</p>
          <div className="mt-[6px] flex items-center gap-[12px]">
            <LeafCoin size={30} />
            <ShopBalanceAmount value={balance} />
          </div>
          <p className="mt-[8px] text-[15px] font-bold leading-[24px] text-[#949494]">
            Earn more by finishing the task!
          </p>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="mt-[36px] px-[15px]">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab("lego")}
            className="flex h-[47px] items-center rounded-[8px] px-[12px] transition"
          >
            <span
              className="text-[15px] font-extrabold leading-[23px] transition"
              style={{ color: activeTab === "lego" ? "#2a2a2a" : "#949494" }}
            >
              Lego Instructions
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cosmetics")}
            className="flex h-[47px] items-center rounded-[8px] px-[12px] transition"
          >
            <span
              className="text-[15px] font-extrabold leading-[23px] transition"
              style={{ color: activeTab === "cosmetics" ? "#2a2a2a" : "#949494" }}
            >
              Companion Cosmetics
            </span>
          </button>
        </div>

        {/* underline indicator */}
        <div className="relative h-[4px] w-full rounded-full" style={{ background: "#F0E0B8" }}>
          <div
            className="absolute top-0 h-[4px] rounded-full bg-[#FFB411] transition-all duration-200"
            style={{ width: 83, left: activeTab === "lego" ? 46 : 200 }}
          />
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="mt-[12px] px-[20px]">
        <div className="relative flex h-[50px] items-center rounded-full" style={{ background: "#FFE9B8" }}>
          <div className="absolute left-[12px] flex h-[26px] w-[26px] items-center justify-center">
            <img src={searchIcon} alt="" width={22} height={22} className="block" draggable={false} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full border-none bg-transparent pl-[46px] pr-[16px] text-[16px] font-extrabold leading-[24px] text-[#949494] outline-none placeholder:text-[#949494]"
          />
        </div>
      </div>

      {/* ── Content header ── */}
      <div className="mt-[20px] px-[20px]">
        <h2 className="text-[20px] font-extrabold leading-[25px] text-[#2a2a2a]">
          {activeTab === "lego" ? "Customize Your Companion!" : "Companion Cosmetics"}
        </h2>
        <p className="mt-[8px] text-[14px] font-bold leading-[19px] text-[#949494]">
          {activeTab === "lego"
            ? "Purchase official Lego instructions to customize your physical companion!"
            : "Unlock decorations for your digital companion in the customization page!"}
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="mt-[20px] flex flex-col gap-[20px] px-[20px]">
        {activeTab === "lego" ? (
          visibleLego.length === 0 ? (
            <p className="py-[40px] text-center text-[14px] font-bold text-[#949494]">No items found.</p>
          ) : (
            visibleLego.map((item) => (
              <LegoCard
                key={item.id}
                item={item}
                purchased={purchasedLegoIds.has(item.id)}
                onPurchase={() => handleLegoPurchase(item)}
              />
            ))
          )
        ) : (
          visibleCosmetics.length === 0 ? (
            <p className="py-[40px] text-center text-[14px] font-bold text-[#949494]">No items found.</p>
          ) : (
            visibleCosmetics.map((item) => (
              <CosmeticCard
                key={item.id}
                item={item}
                purchased={unlockedDecos.has(item.decorationIndex)}
                onPurchase={() => handleCosmeticPurchase(item)}
              />
            ))
          )
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className="fixed bottom-[110px] left-1/2 -translate-x-1/2 rounded-full px-[24px] py-[10px] shadow-lg"
          style={{ background: "#2a2a2a", zIndex: 200 }}
        >
          <span className="whitespace-nowrap text-[14px] font-extrabold text-white">{toast}</span>
        </div>
      )}
    </div>
  );
}
