"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

type Props = {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const shortcuts = [
  {
    label: "This Week",
    icon: "📅",
    get: () => [dayjs().startOf("week"), dayjs().endOf("week")] as const,
  },
  {
    label: "This Month",
    icon: "🗓️",
    get: () => [dayjs().startOf("month"), dayjs().endOf("month")] as const,
  },
  {
    label: "Next 30d",
    icon: "⏭️",
    get: () => [dayjs(), dayjs().add(30, "day")] as const,
  },
  {
    label: "Next 60d",
    icon: "📆",
    get: () => [dayjs(), dayjs().add(60, "day")] as const,
  },
];

export default function DateRangeCalendar({
  startDate,
  endDate,
  onChange,
}: Props) {
  const [viewMonth, setViewMonth] = useState(
    startDate ? dayjs(startDate) : dayjs(),
  );
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const [sliding, setSliding] = useState<"left" | "right" | null>(null);

  const rangeStart = startDate ? dayjs(startDate) : null;
  const rangeEnd = endDate ? dayjs(endDate) : null;

  const previewEnd =
    rangeStart && !rangeEnd && hoverDate && hoverDate.isAfter(rangeStart, "day")
      ? hoverDate
      : null;

  const effectiveEnd = rangeEnd ?? previewEnd;

  // Count days in range
  const dayCount =
    rangeStart && rangeEnd ? rangeEnd.diff(rangeStart, "day") + 1 : 0;

  function handleDayClick(date: Dayjs) {
    const dateStr = date.format("YYYY-MM-DD");
    if (!startDate || (startDate && endDate)) {
      onChange(dateStr, "");
    } else if (date.isBefore(dayjs(startDate), "day")) {
      onChange(dateStr, startDate);
    } else if (date.isSame(dayjs(startDate), "day")) {
      onChange("", "");
    } else {
      onChange(startDate, dateStr);
    }
  }

  function navigateMonth(dir: "left" | "right") {
    setSliding(dir);
    setTimeout(() => {
      setViewMonth(
        dir === "left"
          ? viewMonth.subtract(1, "month")
          : viewMonth.add(1, "month"),
      );
      setSliding(null);
    }, 120);
  }

  // Build calendar grid
  const firstDay = viewMonth.startOf("month");
  const lastDay = viewMonth.endOf("month");
  const startOfGrid = firstDay.startOf("week");
  const endOfGrid = lastDay.endOf("week");

  const weeks: Dayjs[][] = [];
  let current = startOfGrid;
  while (current.isBefore(endOfGrid) || current.isSame(endOfGrid, "day")) {
    const week: Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(current);
      current = current.add(1, "day");
    }
    weeks.push(week);
  }

  const cellSize = 40;

  return (
    <Box>
      {/* Quick Presets */}
      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          px: 1.5,
          pt: 1.5,
          pb: 0.75,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {shortcuts.map((s) => {
          const [sStart, sEnd] = s.get();
          const isActive =
            startDate === sStart.format("YYYY-MM-DD") &&
            endDate === sEnd.format("YYYY-MM-DD");
          return (
            <Chip
              key={s.label}
              label={`${s.icon} ${s.label}`}
              size="small"
              variant={isActive ? "filled" : "outlined"}
              color={isActive ? "primary" : "default"}
              onClick={() => {
                onChange(
                  sStart.format("YYYY-MM-DD"),
                  sEnd.format("YYYY-MM-DD"),
                );
                setViewMonth(sStart);
              }}
              sx={{
                fontSize: "0.7rem",
                height: 30,
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s ease",
                ...(isActive && {
                  boxShadow: "0 2px 8px rgba(13,148,136,0.3)",
                }),
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Selected Range Badge */}
      {rangeStart && rangeEnd && (
        <Fade in>
          <Box
            sx={{
              mx: 1.5,
              my: 1,
              px: 2,
              py: 1,
              borderRadius: 2.5,
              bgcolor: "rgba(13,148,136,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Selected Range
              </Typography>
              <Typography
                variant="body2"
                fontWeight={700}
                color="primary.main"
                sx={{ lineHeight: 1.2 }}
              >
                {rangeStart.format("MMM D")} — {rangeEnd.format("MMM D, YYYY")}
              </Typography>
            </Box>
            <Chip
              label={`${dayCount}d`}
              size="small"
              color="primary"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 24,
                minWidth: 36,
              }}
            />
          </Box>
        </Fade>
      )}

      {/* Month Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 1.5,
          pt: rangeStart && rangeEnd ? 0.5 : 1,
          pb: 0.5,
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigateMonth("left")}
          sx={{
            transition: "transform 0.15s ease",
            "&:hover": { transform: "translateX(-2px)" },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography
          variant="body2"
          fontWeight={700}
          color="text.primary"
          sx={{ letterSpacing: "0.02em" }}
        >
          {viewMonth.format("MMMM YYYY")}
        </Typography>
        <IconButton
          size="small"
          onClick={() => navigateMonth("right")}
          sx={{
            transition: "transform 0.15s ease",
            "&:hover": { transform: "translateX(2px)" },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Weekday Headers */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(7, ${cellSize}px)`,
          justifyContent: "center",
          pb: 0.25,
        }}
      >
        {WEEKDAYS.map((d, idx) => (
          <Typography
            key={`wd-${idx}-${d}`}
            variant="caption"
            sx={{
              textAlign: "center",
              fontWeight: 800,
              py: 0.5,
              color: "text.disabled",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Day Grid */}
      <Box
        sx={{
          pb: 1.5,
          opacity: sliding ? 0.4 : 1,
          transform:
            sliding === "left"
              ? "translateX(8px)"
              : sliding === "right"
                ? "translateX(-8px)"
                : "none",
          transition: "all 0.12s ease",
        }}
        onMouseLeave={() => setHoverDate(null)}
      >
        {weeks.map((week) => (
          <Box
            key={week[0].format("YYYY-MM-DD")}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(7, ${cellSize}px)`,
              justifyContent: "center",
            }}
          >
            {week.map((day) => {
              const isCurrentMonth = day.month() === viewMonth.month();
              const isStart = rangeStart && day.isSame(rangeStart, "day");
              const isEnd = effectiveEnd && day.isSame(effectiveEnd, "day");
              const isBetween =
                rangeStart &&
                effectiveEnd &&
                day.isAfter(rangeStart, "day") &&
                day.isBefore(effectiveEnd, "day");
              const isToday = day.isSame(dayjs(), "day");
              const isSelected = isStart || isEnd;
              const isPreview = !rangeEnd && (isBetween || (isEnd && !isStart));

              const isRangeLeft = isStart && effectiveEnd;
              const isRangeRight = isEnd && rangeStart && !isStart;
              const isRangeMid = isBetween;

              return (
                <Box
                  key={day.format("YYYY-MM-DD")}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: cellSize,
                    ...(isRangeMid && {
                      bgcolor: isPreview
                        ? "rgba(13,148,136,0.04)"
                        : "rgba(13,148,136,0.08)",
                    }),
                    ...(isRangeLeft && {
                      background: isPreview
                        ? "linear-gradient(to right, transparent 50%, rgba(13,148,136,0.04) 50%)"
                        : "linear-gradient(to right, transparent 50%, rgba(13,148,136,0.08) 50%)",
                    }),
                    ...(isRangeRight && {
                      background: isPreview
                        ? "linear-gradient(to left, transparent 50%, rgba(13,148,136,0.04) 50%)"
                        : "linear-gradient(to left, transparent 50%, rgba(13,148,136,0.08) 50%)",
                    }),
                  }}
                >
                  <ButtonBase
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => {
                      if (rangeStart && !rangeEnd) setHoverDate(day);
                    }}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      fontSize: "0.8rem",
                      fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                      transition: "all 0.15s cubic-bezier(0.4,0,0.2,1)",
                      color: !isCurrentMonth
                        ? "rgba(0,0,0,0.15)"
                        : isSelected
                          ? "white"
                          : isBetween
                            ? "primary.dark"
                            : "text.primary",
                      bgcolor: isSelected ? "primary.main" : "transparent",
                      boxShadow: isSelected
                        ? "0 3px 10px rgba(13,148,136,0.4)"
                        : "none",
                      ...(isStart &&
                        rangeEnd && {
                          background:
                            "linear-gradient(135deg, #0d9488, #0f766e)",
                        }),
                      ...(isEnd &&
                        rangeStart &&
                        !isStart && {
                          background:
                            "linear-gradient(135deg, #0f766e, #115e59)",
                        }),
                      ...(isToday &&
                        !isSelected && {
                          border: "2px solid",
                          borderColor: "primary.light",
                          fontWeight: 700,
                          color: "primary.main",
                        }),
                      ...(isPreview &&
                        isEnd && {
                          border: "2px dashed",
                          borderColor: "primary.light",
                          color: "primary.main",
                          fontWeight: 600,
                          bgcolor: "rgba(13,148,136,0.06)",
                        }),
                      "&:hover": {
                        bgcolor: isSelected
                          ? "primary.dark"
                          : "rgba(13,148,136,0.1)",
                        transform: isSelected ? "scale(1.05)" : "scale(1.15)",
                        boxShadow: isSelected
                          ? "0 4px 14px rgba(13,148,136,0.45)"
                          : "0 2px 8px rgba(0,0,0,0.06)",
                      },
                      "&:active": {
                        transform: "scale(0.95)",
                      },
                    }}
                  >
                    {day.date()}
                  </ButtonBase>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Hint */}
      {!rangeStart && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            pb: 1.5,
            color: "text.disabled",
            fontSize: "0.65rem",
          }}
        >
          Tap a date to start selecting a range
        </Typography>
      )}
      {rangeStart && !rangeEnd && !hoverDate && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            pb: 1.5,
            color: "primary.main",
            fontSize: "0.65rem",
            fontWeight: 600,
          }}
        >
          Now tap the end date
        </Typography>
      )}
    </Box>
  );
}
