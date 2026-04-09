import { type FormEvent, useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
};

export function AddTaskSheet({ open, onClose, onAdd }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = inputRef.current?.value?.trim() ?? "";
    if (!raw) return;
    onAdd(raw);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 pb-[max(24px,env(safe-area-inset-bottom))]">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative w-full max-w-[362px] rounded-[24px] bg-card-yellow px-5 py-5 shadow-xl"
      >
        <h2 id={`${id}-title`} className="text-lg font-extrabold text-text">
          New task
        </h2>
        <p className="mt-1 text-sm font-semibold text-text-muted">What do you want to do today?</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <input
            ref={inputRef}
            name="title"
            autoComplete="off"
            placeholder="Task name"
            className="h-12 rounded-2xl border-2 border-[#212121]/15 bg-white px-4 text-[16px] font-semibold text-text placeholder:text-text-muted/70 focus:border-orange-primary focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border-2 border-[#212121]/20 bg-transparent font-extrabold text-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 flex-1 rounded-2xl bg-orange-primary font-extrabold text-text shadow-sm"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
