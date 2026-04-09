import type { EventItem } from "./types";

export function EventCard({ event, onClick }: { event: EventItem; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[182px] w-[361px] rounded-[20px] bg-[#ffb411] text-left active:scale-[0.997]"
    >
      <div className="absolute left-[12px] top-[24px] h-[134px] w-[134px] overflow-hidden rounded-[16px] bg-[#ffe9b8]">
        <img src={event.img} alt="" className="h-full w-full object-cover" draggable={false} />
      </div>
      <p className="absolute left-[154px] top-[12px] text-[20px] font-extrabold leading-[30px] text-[#212121]">
        {event.title}
      </p>
      <p className="absolute left-[154px] top-[56px] text-[15px] font-extrabold leading-[22px] text-[#2a2a2a]">
        {event.dateLine}
      </p>
      <p className="absolute left-[154px] top-[78px] text-[15px] font-extrabold leading-[21px] text-[#2a2a2a]">
        {event.timeLine}
      </p>
      <p className="absolute left-[154px] top-[132px] w-[160px] whitespace-pre-line text-[15px] font-extrabold leading-[21px] text-[#949494]">
        {event.cityLine}
      </p>
    </button>
  );
}

