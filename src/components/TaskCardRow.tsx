import iconCheck from "../../assets/mingcute_check-fill.svg";
import iconLeaf from "../../assets/tabler_leaf-filled.svg";

export type TaskRowModel = {
  id: string;
  title: string;
  done: boolean;
  xp: string;
  xpValue?: number;
  leaf: string;
};

type Props = {
  task: TaskRowModel;
  onToggle: (id: string) => void;
};

/**
 * Pixel-perfect to task component.svg (362×90).
 *
 * Layout from SVG:
 *   - Card: 362×90, bg #FFB411, rounded: TL/BL 30px, TR/BR 10px
 *   - Left indicator dot: 10px circle at (12,41) → center (17,46)
 *   - Left circle: 27px diameter at (30,32) → center (43.5,45)
 *   - Text "Brush Teeth": starts at ~66.8, y≈50 (baseline) → vertically centered
 *   - XP pill: rect at (288,12) 62×29 rx=3, #FFE9B8
 *   - Leaf pill: rect at (288,53) 60×25 rx=12.5, #FFE9B8
 *   - Leaf icon: 16px circle at (332,65.5) #FFB411 with green leaf
 */
export function TaskCardRow({ task, onToggle }: Props) {
  const { id, title, done, xp, leaf } = task;

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="relative flex w-full max-w-[362px] items-center border-0 p-0 text-left shadow-none transition-[background-color,opacity] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      disabled={done}
      style={{
        height: 90,
        borderRadius: "30px 10px 10px 30px",
        backgroundColor: done ? "#6b5a43" : "#FFB411",
      }}
      aria-pressed={done}
    >
      {/* Left dot — 10px circle at (12,41) */}
      <span
        className="absolute rounded-full"
        style={{ width: 10, height: 10, left: 12, top: 41, backgroundColor: done ? "#3e3226" : "#2A2A2A" }}
        aria-hidden
      />

      {/* Left circle — 27px diameter at (30,32) */}
      <span
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 27,
          height: 27,
          left: 30,
          top: 32,
          backgroundColor: done ? "#4a3d2e" : "#FFE9B8",
        }}
      >
        {done && <img src={iconCheck} alt="" className="h-[16px] w-[16px] opacity-80 brightness-0" />}
      </span>

      {/* Title text */}
      <p
        className="absolute text-[16px] font-extrabold leading-[1.25] tracking-[-0.01em]"
        style={{
          left: 67,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 210,
          color: done ? "#d7ccc4" : "#2A2A2A",
          textDecoration: done ? "line-through" : "none",
          textDecorationColor: done ? "#5c4d3d" : undefined,
        }}
      >
        {title}
      </p>

      {/* XP pill — 62×29 at (288,12) rx=3 */}
      <span
        className="absolute flex items-center justify-center text-[15px] font-extrabold text-[#2A2A2A]"
        style={{
          left: 288,
          top: 12,
          width: 62,
          height: 29,
          borderRadius: 3,
          backgroundColor: "#FFE9B8",
          opacity: done ? 0.55 : 1,
        }}
      >
        {xp}
      </span>

      {/* Leaf pill — 60×25 at (288,53) rx=12.5 */}
      <span
        className="absolute flex items-center justify-center gap-[4px] text-[15px] font-extrabold text-[#2A2A2A]"
        style={{
          left: 288,
          top: 53,
          width: 60,
          height: 25,
          borderRadius: 12.5,
          backgroundColor: "#FFE9B8",
          opacity: done ? 0.55 : 1,
        }}
      >
        {leaf}
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{ width: 16, height: 16, backgroundColor: "#FFB411" }}
        >
          <img src={iconLeaf} alt="" className="h-[10px] w-[10px]" />
        </span>
      </span>
    </button>
  );
}
