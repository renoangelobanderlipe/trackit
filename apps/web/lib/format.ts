/**
 * Format a YYYY-MM-DD date string to human-readable format.
 * "2026-01-15" → "Jan 15, 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Short format without year (for same-year dates).
 * "2026-01-15" → "Jan 15"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a currency value.
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(num);
}

/**
 * Decimal-safe subtraction for currency strings.
 * Avoids floating point errors (e.g., 100 - 0.01 = 99.99, not 99.99000000000001).
 */
export function decimalSubtract(a: string, b: string): string {
  const fa = Math.round(Number.parseFloat(a) * 100);
  const fb = Math.round(Number.parseFloat(b) * 100);
  return ((fa - fb) / 100).toFixed(2);
}

/**
 * Parse a Laravel error response string into a user-friendly message.
 */
export function parseApiError(error: string): string {
  try {
    const parsed = JSON.parse(error);
    if (parsed.errors) {
      const firstField = Object.keys(parsed.errors)[0];
      return parsed.errors[firstField][0];
    }
    if (parsed.message) return parsed.message;
    return "Something went wrong.";
  } catch {
    return error || "Something went wrong. Please try again.";
  }
}
