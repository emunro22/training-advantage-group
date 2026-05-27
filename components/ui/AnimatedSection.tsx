"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none" | "scale";
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  const variants = {
    up:    { hidden: { opacity: 0, y: 40 },      visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: -50 },     visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 },      visible: { opacity: 1, x: 0 } },
    none:  { hidden: { opacity: 0 },              visible: { opacity: 1 } },
    scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
