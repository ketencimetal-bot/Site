"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/** Framer Motion'ı hafif modda (LazyMotion) yükler; "hareketi azalt" tercihine uyar. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
