import backIcon from "../../../assets/weui_back-filled.svg";

type Props = {
  name: string;
  username: string;
  onSave: (name: string, username: string) => void;
  onBack: () => void;
};

export function EditProfileScreen({ name, username, onSave, onBack }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-[402px] bg-app-bg" style={{ minHeight: "100dvh" }}>
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="absolute left-[15px] top-[64px] flex h-[31px] w-[74px] items-center rounded-full bg-[#FFB411] shadow-sm"
        aria-label="Back"
      >
        <img src={backIcon} alt="" width={8} height={16} className="absolute left-[12px] top-[7.5px] block" draggable={false} aria-hidden />
        <span className="absolute left-[25px] top-[4px] text-[14px] font-extrabold leading-[23px] text-[#2a2a2a]">Back</span>
      </button>

      <div className="px-[15px] pt-[120px]">
        <h1 className="text-[28px] font-extrabold leading-[40px] text-[#2a2a2a]">Edit Profile</h1>
        <p className="mt-[4px] text-[14px] font-bold text-[#949494]">Update your name and username</p>

        <div className="mt-[32px] flex flex-col gap-[20px]">
          {/* Name field */}
          <div>
            <label className="mb-[8px] block text-[14px] font-extrabold text-[#2a2a2a]">Display Name</label>
            <input
              type="text"
              defaultValue={name}
              id="edit-name"
              className="h-[50px] w-full rounded-[12px] border-none bg-[#FFE9B8] px-[16px] text-[16px] font-extrabold text-[#2a2a2a] outline-none placeholder:text-[#949494]"
              placeholder="Your name"
            />
          </div>

          {/* Username field */}
          <div>
            <label className="mb-[8px] block text-[14px] font-extrabold text-[#2a2a2a]">Username</label>
            <div className="relative">
              <span className="absolute left-[16px] top-[13px] text-[16px] font-extrabold text-[#949494]">@</span>
              <input
                type="text"
                defaultValue={username.replace(/^@/, "")}
                id="edit-username"
                className="h-[50px] w-full rounded-[12px] border-none bg-[#FFE9B8] pl-[30px] pr-[16px] text-[16px] font-extrabold text-[#2a2a2a] outline-none placeholder:text-[#949494]"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const nameEl = document.getElementById("edit-name") as HTMLInputElement;
            const usernameEl = document.getElementById("edit-username") as HTMLInputElement;
            const newName = nameEl?.value.trim() || name;
            const rawUser = usernameEl?.value.trim().replace(/^@/, "") || username.replace(/^@/, "");
            onSave(newName, `@${rawUser}`);
          }}
          className="mt-[40px] flex h-[56px] w-full items-center justify-center rounded-[14px] bg-[#FFB411] text-[18px] font-extrabold text-[#2a2a2a] transition active:scale-[0.98]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
