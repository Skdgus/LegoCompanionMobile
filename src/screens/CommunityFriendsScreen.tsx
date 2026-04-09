import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import searchIcon from "../../assets/searchIcon.svg";
import { MeepiAvatar } from "../components/MeepiAvatar";
import eventImg1 from "../../assets/event-img1.png";
import eventImg2 from "../../assets/event-img2.png";
import { FriendCard } from "../components/community/FriendCard";
import { EventCard } from "../components/community/EventCard";
import { CommunityTabs } from "../components/community/CommunityTabs";
import type { EventItem, Friend } from "../components/community/types";

// (extracted to components)
export function CommunityFriendsScreen() {
  const friends = useMemo<Friend[]>(
    () => [
      { id: "f1", name: "Riley H.", level: "lvl. 24", companion: "Heffy", face: "riley" },
      { id: "f2", name: "Jordan M.", level: "lvl. 13", companion: "Micke", face: "jordan" },
      { id: "f3", name: "Sang H Y.", level: "lvl. 08", companion: "LgjwA", face: "sang" },
    ],
    [],
  );

  const addFriends = useMemo<Friend[]>(
    () => [
      { id: "a1", name: "Kaitlyn M.", level: "lvl. 45", companion: "Mandy", face: "kaitlyn" },
      { id: "a2", name: "Jonathan A.", level: "lvl. 10", companion: "Kumago", face: "jonathan" },
      { id: "a3", name: "Andrew G.", level: "lvl. 221", companion: "Pompe", face: "andrew" },
      { id: "a4", name: "Alastair C.", level: "lvl. 01", companion: "Teddy", face: "alastair" },
      { id: "a5", name: "Gregory H.", level: "lvl. 03", companion: "Mimi", face: "gregory" },
      { id: "a6", name: "Alex H.", level: "lvl. 35", companion: "Kaqo", face: "alex" },
    ],
    [],
  );

  const events = useMemo<EventItem[]>(
    () => [
      {
        id: "e1",
        title: "Lego Convention",
        dateLine: "Fri ~ Sat, Mar20",
        timeLine: "(09:30 ~ 16:30)",
        cityLine: "Toronto . 255\nFront Street West",
        detailLine: "Join us for the biggest Lego convention of the year!",
        img: eventImg1,
      },
      {
        id: "e2",
        title: "Lego DnD",
        dateLine: "Wed, Mar25",
        timeLine: "(12:00 ~ 15:30)",
        cityLine: "Missauga . 6750\nMississauga Rd",
        detailLine: "Join us for the Lego DnD session!",
        img: eventImg2,
      },
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<"friends" | "add" | "events">("friends");
  const [addSubTab, setAddSubTab] = useState<"nearby" | "contacts">("nearby");
  const [pendingIds,   setPendingIds]   = useState<Set<string>>(() => new Set());
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(() => new Set());

  // Per-friend timers so we can cancel if the user un-taps before the 4 s expire
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Update "Friends Made" whenever confirmed friends change
  useEffect(() => {
    try {
      localStorage.setItem(
        "profile.friendsMade",
        String(friends.length + confirmedIds.size),
      );
    } catch { /* ignore */ }
  }, [friends.length, confirmedIds]);

  const handleTogglePending = useCallback((id: string) => {
    setPendingIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) {
        // User cancelled — clear the running timer
        const t = timersRef.current.get(id);
        if (t !== undefined) { clearTimeout(t); timersRef.current.delete(id); }
        next.delete(id);
      } else {
        next.add(id);
        // After 4 s: remove from pending, add to confirmed friends
        const t = setTimeout(() => {
          setPendingIds((p) => { const np = new Set(p); np.delete(id); return np; });
          setConfirmedIds((c) => { const nc = new Set(c); nc.add(id); return nc; });
          timersRef.current.delete(id);
        }, 4000);
        timersRef.current.set(id, t);
      }
      return next;
    });
  }, []);

  // Friends tab shows original friends + any newly confirmed ones
  const allFriends = useMemo(
    () => [...friends, ...addFriends.filter((f) => confirmedIds.has(f.id))],
    [friends, addFriends, confirmedIds],
  );

  const [activeEventId, setActiveEventId]   = useState<string | null>(null);
  const [interestedIds, setInterestedIds]   = useState<Set<string>>(() => new Set());
  const activeEvent = useMemo(() => events.find((e) => e.id === activeEventId) ?? null, [events, activeEventId]);
  const nearbyCount = useMemo(() => {
    // “real-time”: reflect what’s currently shown in Nearby list
    if (activeTab !== "add" || addSubTab !== "nearby") return addFriends.length + 3;
    return addFriends.length + 3;
  }, [activeTab, addSubTab, addFriends.length]);

  return (
    <div className="mx-auto w-full max-w-[402px] bg-app-bg pb-[calc(87px+env(safe-area-inset-bottom,0px)+28px)]">
      <div className="pt-[64px]">
        <div className="px-[21px]">
          <h1 className="text-[28px] font-extrabold leading-[36px] text-[#212121]">Community</h1>
        </div>

        {/* tabs: Component 1 (387×62 at x=8 y=136) */}
        <div className="mt-[36px] px-[8px]">
          <CommunityTabs active={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === "friends" ? (
          <>
            {/* search (Group 167 @ x=21 y=218, w=361 h=50) */}
            <div className="mt-[20px] px-[21px]">
              <div className="relative h-[50px] w-[361px] rounded-full bg-[#ffe9b8]">
                <div className="absolute left-[12px] top-[12px] flex h-[26px] w-[26px] items-center justify-center">
                  <img src={searchIcon} alt="" width={26} height={26} className="block" draggable={false} />
                </div>
                <p className="absolute left-[46px] top-[13px] text-[16px] font-extrabold leading-[24px] text-[#949494]">
                  Search
                </p>
              </div>
            </div>

            {/* friend cards */}
            <div className="mt-[20px] flex flex-col gap-[20px] px-[28px]">
              {allFriends.map((f) => (
                <FriendCard
                  key={f.id}
                  friend={f}
                  pending={false}
                  onTogglePending={() => {}}
                  showAction={false}
                />
              ))}
            </div>
          </>
        ) : activeTab === "add" ? (
          <>
            {/* hero row @ y=218 */}
            <div className="relative mt-[20px] h-[97px] px-[20px]">
              {/* companion tile (106×92). No background, but keep rounded mask */}
              <div className="absolute left-[20px] top-[0px] h-[92px] w-[106px] overflow-hidden rounded-[16px] bg-transparent">
                <MeepiAvatar width={106} height={92} className="h-full w-full" />
              </div>
              {/* near friend info.svg (248×97) */}
              <div className="absolute left-[134px] top-[0px] h-[97px] w-[248px]">
                <svg width="248" height="97" viewBox="0 0 248 97" fill="none" className="absolute inset-0" aria-hidden="true">
                  <rect width="248" height="97" rx="10" fill="#FFC341" />
                  <circle cx="44" cy="48.5001" r="19.7817" stroke="#8DA9C8" />
                  <circle cx="44.0002" cy="48.5001" r="24.6901" stroke="#8DA9C8" strokeWidth="2" />
                  <circle cx="44" cy="48.5" r="31.5" stroke="#8DA9C8" />
                  <circle cx="43.9999" cy="48.5001" r="8.56338" fill="#8DA9C8" />
                  <circle cx="26.8732" cy="21.4579" r="3.15493" fill="#C4210C" />
                  <circle cx="59.3234" cy="36.7816" r="3.15493" fill="#C4210C" />
                  <circle cx="17.86" cy="66.5282" r="3.15493" fill="#C4210C" />
                  <circle cx="71.943" cy="63.8241" r="3.15493" fill="#C4210C" />
                  <circle cx="58.423" cy="62.0213" r="3.15493" fill="#C4210C" />
                  <circle cx="26.8736" cy="21.4575" r="2.25352" fill="#FFF7E7" />
                  <circle cx="59.3243" cy="36.7818" r="2.25352" fill="#FFF7E7" />
                  <circle cx="17.8585" cy="66.5281" r="2.25352" fill="#FFF7E7" />
                  <circle cx="71.9435" cy="63.824" r="2.25352" fill="#FFF7E7" />
                  <circle cx="58.422" cy="62.0212" r="2.25352" fill="#FFF7E7" />
                </svg>
                <p className="absolute left-[93px] top-[12px] w-[151px] text-[18px] font-extrabold leading-[23px] text-[#212121]">
                  {String(nearbyCount).padStart(2, "0")}
                </p>
                <p className="absolute left-[93px] top-[43px] w-[151px] text-[15px] font-extrabold leading-[21px] text-[#2a2a2a]">
                  people around you,
                  <br />
                  have a companion!
                </p>
              </div>
            </div>

            {/* Nearby / From Contacts toggle (Group 201) */}
            <div className="mt-[36px] flex justify-center">
              <div className="relative h-[51px] w-[227px]">
                <div className="absolute left-0 top-0 h-[44px] w-[227px] rounded-[14px] bg-[#ffe9b8]" />
                <button
                  type="button"
                  onClick={() => setAddSubTab("nearby")}
                  className="absolute left-0 top-0 h-[44px] w-[89px] text-[16px] font-extrabold leading-[24px] text-[#212121]"
                >
                  Nearby
                </button>
                <button
                  type="button"
                  onClick={() => setAddSubTab("contacts")}
                  className="absolute left-[89px] top-0 h-[44px] w-[138px] text-[16px] font-extrabold leading-[24px] text-[#212121]"
                >
                  From Contacts
                </button>
                <div
                  className="absolute bottom-0 h-[4px] w-[67px] rounded-full bg-[#ffb411]"
                  style={{ left: addSubTab === "nearby" ? 14 : 128 }}
                />
              </div>
            </div>

            {addSubTab === "contacts" ? (
              <div className="mt-[36px] px-[21px]">
                <button
                  type="button"
                  className="relative flex h-[140px] w-[361px] items-center justify-center rounded-[20px] bg-[#ffe9b8] text-[#212121] active:scale-[0.997]"
                >
                  <p className="text-[18px] font-extrabold leading-[24px]">Connect contact</p>
                </button>
              </div>
            ) : (
              <>
                {/* search @ y=410 */}
                <div className="mt-[20px] px-[21px]">
                  <div className="relative h-[50px] w-[361px] rounded-full bg-[#ffe9b8]">
                    <div className="absolute left-[12px] top-[12px] flex h-[26px] w-[26px] items-center justify-center">
                      <img src={searchIcon} alt="" width={26} height={26} className="block" draggable={false} />
                    </div>
                    <p className="absolute left-[46px] top-[13px] text-[16px] font-extrabold leading-[24px] text-[#949494]">
                      Search
                    </p>
                  </div>
                </div>

                {/* add friend cards start at x=21 */}
                <div className="mt-[20px] flex flex-col gap-[20px] px-[21px]">
                  {addFriends.filter((f) => !confirmedIds.has(f.id)).map((f) => (
                    <FriendCard
                      key={f.id}
                      friend={f}
                      pending={pendingIds.has(f.id)}
                      onTogglePending={() => handleTogglePending(f.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* events list */}
            <div className="mt-[20px] flex flex-col gap-[20px] px-[21px]">
              {events.map((e) => (
                <EventCard key={e.id} event={e} onClick={() => setActiveEventId(e.id)} />
              ))}
            </div>
          </>
        )}

        {/* ── Event detail popup — centred floating card ── */}
        {activeEvent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-[20px]">
            {/* Backdrop — tap to close */}
            <button
              type="button"
              className="absolute inset-0 bg-[#212121]/60"
              aria-label="Close event details"
              onClick={() => setActiveEventId(null)}
            />

            {/* Floating card — all-round corners, auto height */}
            <div className="relative z-10 w-full max-w-[362px] overflow-hidden rounded-[26px] bg-[#ffb411] shadow-xl">
              {/* Event image */}
              <div className="h-[200px] w-full overflow-hidden">
                <img src={activeEvent.img} alt="" className="h-full w-full object-cover" draggable={false} />
              </div>

              {/* Content */}
              <div className="px-[24px] pb-[24px] pt-[20px]">
                <p className="text-[24px] font-extrabold leading-[32px] text-[#212121]">{activeEvent.title}</p>
                <p className="mt-[10px] text-[15px] font-extrabold leading-[22px] text-[#2a2a2a]">{activeEvent.dateLine}</p>
                <p className="mt-[2px] text-[13px] font-extrabold leading-[19px] text-[#2a2a2a]">{activeEvent.timeLine}</p>
                <p className="mt-[10px] whitespace-pre-line text-[13px] font-extrabold leading-[19px] text-[#949494]">
                  {activeEvent.cityLine}
                </p>
                <p className="mt-[16px] text-[14px] font-semibold leading-[22px] text-[#212121]">
                  {activeEvent.detailLine}
                </p>

                {/* Mark as Interested — toggles between marked / unmarked */}
                {interestedIds.has(activeEvent.id) ? (
                  <div className="mt-[24px] flex flex-col items-center gap-[8px]">
                    <div className="flex h-[60px] w-full items-center justify-center rounded-[18px] bg-[#d4edda]">
                      <span className="text-[16px] font-extrabold text-[#2a7a3b]">✓ Marked interested!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setInterestedIds((cur) => {
                          const next = new Set(cur);
                          next.delete(activeEvent.id);
                          return next;
                        })
                      }
                      className="text-[15px] font-semibold text-[#888] underline underline-offset-2 transition active:opacity-60"
                    >
                      Remove interest
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setInterestedIds((cur) => {
                        const next = new Set(cur);
                        next.add(activeEvent.id);
                        return next;
                      })
                    }
                    className="mt-[24px] h-[60px] w-full rounded-[18px] bg-[#ffe9b8] text-[17px] font-extrabold text-[#212121] transition active:scale-[0.98]"
                  >
                    Mark as Interested
                  </button>
                )}

                {/* Close */}
                <button
                  type="button"
                  className="mt-[10px] h-[46px] w-full rounded-[18px] bg-[#fff6e6] text-[15px] font-semibold text-[#212121] transition active:scale-[0.98]"
                  onClick={() => setActiveEventId(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

