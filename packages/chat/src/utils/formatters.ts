/**
 * Utility formatting functions for the chat module.
 * These are framework-agnostic and work with any locale.
 */

/**
 * Formats bytes into a human-readable string (e.g., "2.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

/**
 * Formats a number with thousands separators based on locale.
 */
export const formatCurrency = (
  value: number | string,
  locale: string = "en",
): string => {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  if (isNaN(num)) return String(value);

  const targetLocale = locale === "fa" ? "fa-IR" : locale;
  return new Intl.NumberFormat(targetLocale).format(num);
};

/**
 * Replaces all English digits with locale-appropriate digits.
 */
export const replaceDigitsByLocale = (
  value: string | number,
  locale: string = "en",
): string => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (locale !== "fa") return str;

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

/**
 * Formats a phone number into a readable standard.
 * Example: 09134168227 -> 0913 416 8227
 */
export const formatPhoneNumber = (
  identifier: string,
  dir: string = "ltr",
): string => {
  if (!identifier) return "";
  const clean = identifier.replace(/\D/g, "");

  if (clean.length === 11 && clean.startsWith("09")) {
    const formatted = `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    return dir === "rtl" ? `\u200E${formatted}` : formatted;
  }

  return clean;
};

/**
 * Formats seconds into MM:SS countdown string.
 */
export const formatCountdown = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "00 : 00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
};

/**
 * Formats seconds into HH:MM:SS or MM:SS duration string.
 */
export const formatDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const padded = (val: number) => val.toString().padStart(2, "0");

  if (hours > 0) {
    return `${padded(hours)}:${padded(minutes)}:${padded(seconds)}`;
  }
  return `${padded(minutes)}:${padded(seconds)}`;
};

/**
 * Formats a date to a short readable format based on locale.
 */
export const formatDateShort = (date: Date, locale: string = "en"): string => {
  const targetLocale = locale === "fa" ? "fa-IR" : locale;
  return new Intl.DateTimeFormat(targetLocale, {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

/**
 * Formats a date to time only (HH:mm).
 */
export const formatTime = (date: Date, locale: string = "en"): string => {
  const targetLocale = locale === "fa" ? "fa-IR" : locale;
  return new Intl.DateTimeFormat(targetLocale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

/**
 * Formats a date as relative time ("5 min ago", "Yesterday", etc.)
 */
export const formatRelativeDate = (
  date: Date,
  locale: string = "en",
): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return locale === "fa" ? "الان" : "Just now";
  if (minutes < 60)
    return locale === "fa" ? `${minutes} دقیقه پیش` : `${minutes}m ago`;
  if (hours < 24)
    return locale === "fa" ? `${hours} ساعت پیش` : `${hours}h ago`;
  if (days < 7)
    return locale === "fa" ? `${days} روز پیش` : `${days}d ago`;

  return formatDateShort(date, locale);
};

/**
 * Calculate years passed from a given date (useful for age calculation).
 */
export const getYearsPassed = (date: Date): number => {
  const now = new Date();
  const birth = new Date(date);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
