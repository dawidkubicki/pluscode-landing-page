"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background video for the hero. With one source it simply loops; with several
 * it plays them in order and cycles back to the first, fading out/in around each
 * switch so the change is smooth (the dark tint shows through during the fade).
 */
export default function HeroVideo({
  sources,
  className = "",
}: {
  sources: string[];
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false);
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const single = sources.length <= 1;

  // Advance to the next clip once the current one finishes (multi-clip only).
  const handleEnded = () => {
    if (single) return;
    setFading(true);
    window.setTimeout(() => setIndex((i) => (i + 1) % sources.length), 700);
  };

  // After the source changes, load the new clip, play it and fade back in.
  // Skip on first mount so `autoPlay` handles the very first clip cleanly.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    v.load();
    const onReady = () => {
      v.play().catch(() => {});
      setFading(false);
    };
    v.addEventListener("loadeddata", onReady, { once: true });
    return () => v.removeEventListener("loadeddata", onReady);
  }, [index]);

  return (
    <video
      ref={videoRef}
      src={sources[index]}
      autoPlay
      muted
      playsInline
      preload="auto"
      loop={single}
      onEnded={handleEnded}
      className={`${className} transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}
