import plusIcon from "../../../assets/uil_plus.svg";
import requestSentIcon from "../../../assets/request-sent.svg";
import type { Friend } from "./types";
import { FaceIcon } from "../icons/FaceIcon";

export function FriendCard({
  friend,
  pending,
  onTogglePending,
  showAction = true,
  className,
}: {
  friend: Friend;
  pending: boolean;
  onTogglePending: () => void;
  showAction?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative h-[101px] w-[347px] ${className ?? ""}`}>
      {/* near friend card.svg background shape */}
      <svg className="absolute inset-0" width="347" height="101" viewBox="0 0 347 101" fill="none" aria-hidden="true">
        <path
          d="M0 20C0 8.95431 8.9543 0 20 0H307C329.091 0 347 17.9086 347 40V61C347 83.0914 329.091 101 307 101H20C8.95432 101 0 92.0457 0 81V20Z"
          fill="#FFE9B8"
        />
      </svg>

      {/* avatar group 265 */}
      <div className="absolute left-[12px] top-[17px] h-[67px] w-[67px]">
        <FaceIcon variant={friend.face} />
      </div>

      {/* Frame 18 — Figma: x=140 relative to group at x=21 → local left=119, top=24 */}
      <div className="absolute left-[119px] top-[24px] flex items-center">
        <p className="text-[18px] font-extrabold leading-[26px] text-[#212121]">{friend.name}</p>
        <p className="ml-[8px] mt-[3.5px] text-[15px] font-extrabold leading-[21px] text-[#949494]">{friend.level}</p>
      </div>

      <p className="absolute left-[119px] top-[56px] text-[15px] font-extrabold leading-[21px] text-[#2a2a2a]">
        Companion: <span className="font-extrabold">{friend.companion}</span>
      </p>

      {showAction && (
        <button
          type="button"
          onClick={onTogglePending}
          className="absolute right-[12px] top-[31px] flex h-[40px] w-[40px] items-center justify-center rounded-full border-none outline-none transition active:scale-[0.98]"
          style={{ backgroundColor: pending ? "transparent" : "#ffb411" }}
          aria-label={pending ? "Request sent" : "Send friend request"}
        >
          <img
            src={pending ? requestSentIcon : plusIcon}
            alt=""
            width={pending ? 40 : 30}
            height={pending ? 40 : 30}
            className="block"
            draggable={false}
          />
        </button>
      )}
    </div>
  );
}

