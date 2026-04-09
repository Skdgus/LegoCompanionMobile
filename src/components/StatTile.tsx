import statTileShape from "../../assets/Subtract.svg";

export type StatConfig = {
  icon: string;
  alt: string;
  fill: string;
  pct: number;
};

export const STAT_W = 75.4462890625;
export const STAT_H = 71.392578125;

const ELLIPSE = 29.172618865966797;
const BAR_W = 51;
const BAR_H = 10.0999755859375;

export function StatTile({ icon, alt, fill, pct }: StatConfig) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: STAT_W, height: STAT_H }}
    >
      <img
        src={statTileShape}
        alt=""
        className="pointer-events-none absolute inset-0 size-full max-w-none object-fill"
        aria-hidden
      />
      <div className="relative z-10 flex h-full flex-col items-center pt-[12px]">
        <div
          className="flex items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
          style={{ width: ELLIPSE, height: ELLIPSE }}
        >
          <img src={icon} alt="" className="max-h-[20px] max-w-[20px] object-contain" aria-hidden />
        </div>
        <span className="sr-only">{alt}</span>
        <div
          className="mt-[8px] overflow-hidden rounded-full bg-white"
          style={{ width: BAR_W, height: BAR_H }}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: fill }}
          />
        </div>
      </div>
    </div>
  );
}
