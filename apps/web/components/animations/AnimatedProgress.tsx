"use client";

import LinearProgress from "@mui/material/LinearProgress";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  sx?: Record<string, unknown>;
};

export default function AnimatedProgress({ value, sx }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (inView) {
      // Small delay for visual effect
      const timer = setTimeout(() => setAnimated(value), 100);
      return () => clearTimeout(timer);
    }
  }, [inView, value]);

  return (
    <div ref={ref}>
      <LinearProgress
        variant="determinate"
        value={Math.min(animated, 100)}
        sx={{
          transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
          "& .MuiLinearProgress-bar": {
            transition:
              "transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) !important",
          },
          ...sx,
        }}
      />
    </div>
  );
}
