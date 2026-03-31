"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "glass";
};

const sizes = {
  sm: { box: 28, font: "0.75rem" },
  md: { box: 32, font: "0.85rem" },
  lg: { box: 52, font: "1.4rem" },
};

export default function TiLogo({ size = "md", variant = "solid" }: Props) {
  const { box, font } = sizes[size];

  return (
    <Box
      sx={{
        width: box,
        height: box,
        borderRadius: size === "lg" ? 3 : size === "md" ? 2 : 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(variant === "solid"
          ? {
              background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
              ...(size === "lg" && {
                boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
              }),
            }
          : {
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.06)",
            }),
      }}
    >
      <Typography
        sx={{
          fontSize: font,
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        Ti
      </Typography>
    </Box>
  );
}
