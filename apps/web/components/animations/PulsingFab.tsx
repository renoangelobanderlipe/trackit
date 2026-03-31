"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Fab from "@mui/material/Fab";
import { motion } from "motion/react";
import Link from "next/link";

export default function PulsingFab({ href }: { href: string }) {
  return (
    <Link
      href={href}
      style={{ position: "fixed", bottom: 80, right: 16, zIndex: 10 }}
    >
      <motion.div
        animate={{
          boxShadow: [
            "0 4px 20px rgba(13,148,136,0.3)",
            "0 4px 30px rgba(13,148,136,0.5)",
            "0 4px 20px rgba(13,148,136,0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ borderRadius: 16 }}
      >
        <Fab color="primary">
          <HugeiconsIcon icon={Add01Icon} size={24} />
        </Fab>
      </motion.div>
    </Link>
  );
}
