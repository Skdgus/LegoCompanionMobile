import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { MeepiCharacter } from "../components/MeepiAvatar";
import brickStack from "../../assets/brick-stack.svg";

/** Hardcoded default companion — light blue, basic happy face, no decoration. */
const DEFAULT_STATE = {
  eyes:       0,
  mouth:      0,
  eyebrow:    0,
  decoration: 0,
  color:      12,   // #84bfea — friendly light blue
};

/** Height of the brick-stack SVG (matches its viewBox). */
const BRICK_H = 170;

type Props = { onStart: () => void };

export function SplashScreen({ onStart }: Props) {
  /**
   * Button starts at pale cream (#FFE9B8) while it fades in,
   * then blooms to golden yellow (#FFC341) ~1s after mount.
   */
  const [btnActive, setBtnActive] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setBtnActive(true), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      className="relative mx-auto flex min-h-dvh w-full max-w-[402px] flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Top panel: amber gradient + companion ────────────────────────── */}
      <div
        className="relative flex flex-[13] flex-col items-center justify-end overflow-hidden pt-[20px] pb-[12px]"
        style={{
          background: "linear-gradient(175deg, #FFD54F 0%, #FFC341 100%)",
          borderBottomLeftRadius: 52,
          borderBottomRightRadius: 52,
        }}
      >
        {/* Soft decorative blobs */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 rounded-full"
          style={{ width: 260, height: 260, background: "rgba(255,255,255,0.18)" }}
        />
        <div
          className="pointer-events-none absolute -left-10 top-10 rounded-full"
          style={{ width: 180, height: 180, background: "rgba(255,255,255,0.12)" }}
        />

        {/* Default companion — slides up & fades in */}
        <motion.div
          style={{ width: 270, height: 240 }}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
        >
          <MeepiCharacter state={DEFAULT_STATE} />
        </motion.div>
      </div>

      {/* ── Bottom panel: headline + button + brick stack ─────────────────── */}
      <div
        className="relative flex flex-[11] flex-col items-center px-8"
        style={{
          background: "#fff8e1",
          paddingTop: 36,
          paddingBottom: BRICK_H + 36, // 36px gap between button and brick stack
        }}
      >
        {/* Headline — fades up */}
        <motion.p
          className="text-center text-[26px] font-extrabold leading-[1.3] text-[#1a1a1a]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
        >
          Start self-care journey with a LEGO companion
        </motion.p>

        {/* Get Started — 36px below text, colour blooms cream → golden */}
        <motion.button
          type="button"
          className="w-full rounded-full py-[18px] text-[18px] font-extrabold text-[#1a1a1a] shadow-md active:scale-[0.97]"
          style={{
            marginTop: 36,
            backgroundColor: btnActive ? "#FFC341" : "#FFE9B8",
            transition: "background-color 0.75s ease, transform 0.1s",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: "easeOut" }}
          onClick={onStart}
        >
          Get Started
        </motion.button>

        {/* ── Brick stack — anchored to the very bottom ─────────────────── */}
        <motion.img
          src={brickStack}
          alt=""
          aria-hidden
          className="absolute bottom-0 left-0 w-full"
          style={{ height: BRICK_H, objectFit: "fill" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
