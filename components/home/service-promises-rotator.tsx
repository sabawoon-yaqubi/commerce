"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 4500;

export function ServicePromisesRotator({
  items,
}: {
  items: readonly string[];
}) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reduceMotion || items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [items.length, reduceMotion]);

  if (reduceMotion) {
    return (
      <ul className="flex flex-col gap-2.5 text-center">
        {items.map((item) => (
          <li
            key={item}
            className="text-[11px] font-medium uppercase leading-snug tracking-[0.14em] text-[#6e6962]"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const n = items.length;
  // Outer clips one “viewport”; inner track is N× wide so each slide is exactly 1/N of the track.
  // (min-w-full on flex children breaks % math — widths must be explicit.)
  return (
    <div className="relative w-full min-w-0 overflow-hidden">
      <div
        className="flex flex-row transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          width: `${n * 100}%`,
          transform: `translateX(-${(index * 100) / n}%)`,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            className="box-border flex h-11 shrink-0 items-center justify-center px-3 text-center"
            style={{ width: `${100 / n}%` }}
          >
            <span className="line-clamp-2 text-balance text-[10px] font-medium uppercase leading-tight tracking-[0.14em] text-[#6e6962]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
