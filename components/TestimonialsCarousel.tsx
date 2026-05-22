"use client";
import { useRef, useState } from "react";
import styles from "./TestimonialsCarousel.module.scss";
import iconCaret from "../public/icon-caret-second.svg"

const testimonials = [
  {
    name: "Alex M.",
    text: "Found Spark through a friend and never looked back. The energy here is unmatched — productive and inspiring at the same time.",
  },
  {
    name: "Olha K.",
    text: "It feels like more than just a coworking space – it's a community where you can focus, create, and grow.",
  },
  {
    name: "Michael R.",
    text: "I started coming just for a day, but now it's my everyday spot. Reliable internet, quiet spaces, and great coffee!",
  },
  {
    name: "Anna S.",
    text: "Spark changed the way I work. The vibe is inspiring, and I've met so many amazing people here!",
  },
  {
    name: "Dmytro V.",
    text: "Perfect for remote work. Fast Wi-Fi, great coffee, and an atmosphere that keeps me focused all day.",
  },
  {
    name: "Alex Ma.",
    text: "Found Spark through a friend and never looked back. The energy here is unmatched — productive and inspiring at the same time.",
  },
  {
    name: "Olha Ka.",
    text: "It feels like more than just a coworking space – it's a community where you can focus, create, and grow.",
  },
  {
    name: "Michael Ra.",
    text: "I started coming just for a day, but now it's my everyday spot. Reliable internet, quiet spaces, and great coffee!",
  },
  {
    name: "Anna Sa.",
    text: "Spark changed the way I work. The vibe is inspiring, and I've met so many amazing people here!",
  },
  {
    name: "Dmytro Va.",
    text: "Perfect for remote work. Fast Wi-Fi, great coffee, and an atmosphere that keeps me focused all day.",
  },
];

const N = testimonials.length;

const SCALE   = [1, 0.95, 0.85] as const; 
const OPACITY = [1, 0.7, 0.45] as const;

const POSITIONS = [0, 1.15, 2.25] as const; 

function getOffset(cardIdx: number, activeIdx: number): number {
  const actualActive = ((activeIdx % N) + N) % N;
  let off = (cardIdx - actualActive + N) % N;
  if (off > Math.floor(N / 2)) off -= N;
  return off;
}

const PersonIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="16" r="8" fill="#b0b2bc" />
    <path d="M4 38c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#b0b2bc" />
  </svg>
);

const SWIPE_THRESHOLD = 40;

export default function TestimonialsCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setActiveIdx((i) => i - 1);
  const next = () => setActiveIdx((i) => i + 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > SWIPE_THRESHOLD) next();
    else if (delta < -SWIPE_THRESHOLD) prev();
    touchStartX.current = null;
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>WHAT OUR MEMBERS SAY</h2>

      <div
        className={styles.track}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((t, i) => {
          const offset = getOffset(i, activeIdx);
          const absOff = Math.abs(offset);
          
          const scale   = SCALE[Math.min(absOff, SCALE.length - 1)];
          const opacity = OPACITY[Math.min(absOff, OPACITY.length - 1)];
          
          // NEW: Get exact position multiplier and apply positive/negative direction
          const posMultiplier = POSITIONS[Math.min(absOff, POSITIONS.length - 1)];
          const positionX = offset < 0 ? -posMultiplier : posMultiplier;

          const zIndex  = 10 - absOff;
          const visible = absOff <= 2;

          return (
            <div
              key={t.name}
              className={styles.card}
              style={{
                // UPDATED: Use positionX instead of offset
                transform: `translate(calc(-50% + ${positionX} * var(--step)), -50%) scale(${scale})`,
                opacity: visible ? opacity : 0,
                zIndex,
                pointerEvents: absOff === 0 ? "auto" : "none",
              }}
              onClick={
                offset === 1  ? next :
                offset === -1 ? prev :
                undefined
              }
            >
              <div className={styles.cardMeta}>
                <div className={styles.avatar}>
                  {t.name.slice(0,1)}
                </div>
                <span className={styles.name}>{t.name}</span>
              </div>
              <p className={styles.text}>{t.text}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.navRow}>
        <button onClick={prev} className={styles.navBtn} aria-label="Previous">
          <img src={iconCaret.src} alt="" />
        </button>
        <button onClick={next} className={styles.navBtn} aria-label="Next">
          <img src={iconCaret.src} alt="" />
        </button>
      </div>
    </section>
  );
}
