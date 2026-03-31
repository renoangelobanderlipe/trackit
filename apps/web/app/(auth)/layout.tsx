import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "50%",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#080f0e",
          color: "white",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 100%, rgba(13,148,136,0.4) 0%, transparent 55%), radial-gradient(ellipse at 70% 0%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(13,148,136,0.08) 0%, transparent 60%)",
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.035,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <FloatingCard
          top="12%"
          right="8%"
          width={220}
          rotate={6}
          opacity={0.06}
        >
          <Typography
            sx={{
              fontSize: "0.55rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              mb: 0.75,
            }}
          >
            Monthly Payment
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              mb: 1.5,
            }}
          >
            ₱1,500.00
          </Typography>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.1)",
              mb: 0.75,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "65%",
                borderRadius: 2,
                background: "linear-gradient(90deg, #5eead4, #0d9488)",
              }}
            />
          </Box>
          <Typography
            sx={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.3)" }}
          >
            4 of 6 paid
          </Typography>
        </FloatingCard>

        <FloatingCard
          top="38%"
          right="22%"
          width={160}
          rotate={-3}
          opacity={0.04}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#5eead4",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Billease
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            ₱9,000
          </Typography>
          <Typography
            sx={{
              fontSize: "0.5rem",
              color: "rgba(255,255,255,0.25)",
              mt: 0.5,
            }}
          >
            Due Jan 25
          </Typography>
        </FloatingCard>

        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 48,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            zIndex: 2,
          }}
        >
          <GlassLogo size={32} fontSize="0.85rem" />
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.02em",
            }}
          >
            TrackIt
          </Typography>
        </Box>

        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            sx={{
              fontSize: "2.8rem",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              mb: 2,
            }}
          >
            Loan tracking,
            <br />
            <GradientText>simplified.</GradientText>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.85rem",
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Auto-generated installments, real-time payment tracking, and a
            dashboard that shows exactly where you stand.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#fafbfc",
        }}
      >
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            background: "#080f0e",
            color: "white",
            px: 3,
            pt: "calc(env(safe-area-inset-top, 0px) + 40px)",
            pb: 4.5,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 70% 100%, rgba(13,148,136,0.35) 0%, transparent 55%), radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.1) 0%, transparent 50%)",
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              position: "relative",
            }}
          >
            <GlassLogo size={28} fontSize="0.75rem" />
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              TrackIt
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "1.75rem",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              position: "relative",
            }}
          >
            Loan tracking,
            <br />
            <GradientText>simplified.</GradientText>
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-start", md: "center" },
            alignItems: "center",
            px: { xs: 3, sm: 6 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 380 }}>{children}</Box>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            pb: 2.5,
            color: "text.disabled",
            fontSize: "0.6rem",
            letterSpacing: "0.05em",
          }}
        >
          &copy; 2026 TrackIt
        </Typography>
      </Box>
    </Box>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        background: "linear-gradient(90deg, #5eead4 0%, #0d9488 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </Box>
  );
}

function GlassLogo({ size, fontSize }: { size: number; fontSize: string }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ fontSize, fontWeight: 800, letterSpacing: "-0.03em" }}>
        Ti
      </Typography>
    </Box>
  );
}

function FloatingCard({
  children,
  top,
  right,
  width,
  rotate,
  opacity,
}: {
  children: React.ReactNode;
  top: string;
  right: string;
  width: number;
  rotate: number;
  opacity: number;
}) {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        top,
        right,
        width,
        transform: `rotate(${rotate}deg)`,
        zIndex: rotate > 0 ? 1 : 0,
      }}
    >
      <Box
        sx={{
          bgcolor: `rgba(255,255,255,${opacity})`,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: rotate > 0 ? 4 : 3,
          p: rotate > 0 ? 2.5 : 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
