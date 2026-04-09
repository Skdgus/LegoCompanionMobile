export function CommunityTabs({
  active,
  onChange,
}: {
  active: "friends" | "add" | "events";
  onChange: (t: "friends" | "add" | "events") => void;
}) {
  return (
    <div className="relative h-[62px] w-[387px] rounded-[16px] bg-[#ffe9b8]">
      <div className="grid h-[54px] grid-cols-3 items-center px-[18px] pt-[10px]">
        <button
          type="button"
          onClick={() => onChange("friends")}
          className="justify-self-start text-[18px] font-extrabold leading-[24px] text-[#212121]"
        >
          Friends
        </button>
        <button
          type="button"
          onClick={() => onChange("add")}
          className="justify-self-center text-[18px] font-extrabold leading-[24px] text-[#212121]"
        >
          Add Friend
        </button>
        <button
          type="button"
          onClick={() => onChange("events")}
          className="justify-self-end text-[18px] font-extrabold leading-[24px] text-[#212121]"
        >
          Events
        </button>
      </div>

      <div
        className="absolute bottom-[8px] h-[4px] w-[64px] rounded-full bg-[#ffb411] transition-[left] duration-200"
        style={{
          left: active === "friends" ? 28 : active === "add" ? 161 : 306,
        }}
      />
    </div>
  );
}

