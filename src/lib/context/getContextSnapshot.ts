import { ContextOptions, ContextSnapshot, DayPhase, DayType, UiMode } from "../contracts/context";

/**
 * Calculates the Easter Sunday date for a given year using the anonymous algorithm (Meeus/Jones/Butcher).
 * Returns date string "YYYY-MM-DD"
 */
function getEasterSunday(year: number): string {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
}

interface HolidayMap {
    [date: string]: string; // "MM-DD" -> "Name"
}

// Bavarian Fixed Holidays
const FIXED_HOLIDAYS: HolidayMap = {
    "01-01": "Neujahr",
    "01-06": "Heilige Drei Könige",
    "05-01": "Tag der Arbeit",
    "08-15": "Mariä Himmelfahrt",
    "10-03": "Tag der Deutschen Einheit",
    "11-01": "Allerheiligen",
    "12-25": "1. Weihnachtstag",
    "12-26": "2. Weihnachtstag",
};

function getRegionalHoliday(date: Date, year: number): string | null {
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const md = dateStr.slice(5); // MM-DD

    // Check fixed
    if (FIXED_HOLIDAYS[md]) return FIXED_HOLIDAYS[md];

    // Check dynamic (Easter based)
    const easterStr = getEasterSunday(year);
    const karfreitag = addDays(easterStr, -2);
    const ostermontag = addDays(easterStr, 1);
    const christihimmelfahrt = addDays(easterStr, 39);
    const pfingstmontag = addDays(easterStr, 50);
    const fronleichnam = addDays(easterStr, 60);

    if (dateStr === karfreitag) return "Karfreitag";
    if (dateStr === ostermontag) return "Ostermontag";
    if (dateStr === christihimmelfahrt) return "Christi Himmelfahrt";
    if (dateStr === pfingstmontag) return "Pfingstmontag";
    if (dateStr === fronleichnam) return "Fronleichnam";

    return null;
}

// Mock School Holidays for Bavaria 2024/2025/2026 (Simplified)
const SCHOOL_HOLIDAYS = [
    { start: "2024-12-23", end: "2025-01-03", name: "Weihnachtsferien" },
    { start: "2025-03-03", end: "2025-03-07", name: "Frühjahrsferien" },
    { start: "2025-04-14", end: "2025-04-25", name: "Osterferien" },
    { start: "2025-06-10", end: "2025-06-20", name: "Pfingstferien" },
    { start: "2025-08-01", end: "2025-09-15", name: "Sommerferien" },
    { start: "2025-11-03", end: "2025-11-07", name: "Herbstferien" },
    { start: "2025-12-22", end: "2026-01-05", name: "Weihnachtsferien" },
];

function getSchoolHolidayRange(dateStr: string): { start: string; end: string } | null {
    for (const h of SCHOOL_HOLIDAYS) {
        if (dateStr >= h.start && dateStr <= h.end) {
            return { start: h.start, end: h.end };
        }
    }
    return null;
}

function getDayPhase(hour: number): DayPhase {
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 22) return "evening";
    return "night";
}

function getUiMode(hour: number, dayType: DayType): UiMode {
    // Logic: Calm at night/early morning. Nerdy during work. Manga for fun/weekend?
    // User asked for "calm" | "nerdy" | "manga"
    // Let's implement a simple heuristic:
    if (hour >= 22 || hour < 6) return "calm";
    if (dayType === "weekend" || dayType === "holiday") return "manga";
    return "nerdy";
}

export function getContextSnapshot(options: ContextOptions = {}): ContextSnapshot {
    const now = options.date || new Date();

    // Use local time for calculations (ensure we operate on the intended local time)
    // NOTE: In a real server env, 'now' might be UTC, so we might need timezone offset handling.
    // For this MVP, we assume the server/Date is configured to or matches the target TZ or we are passing a Date object that represents the correct instant.
    // If strict TZ handling is needed, we would use something like `date-fns-tz`.
    // Here we just use the Date object methods which effectively use the system local time or the passed date.

    const year = now.getFullYear();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat

    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0];

    const regionalHoliday = getRegionalHoliday(now, year);
    const schoolHolidayRange = getSchoolHolidayRange(dateStr);

    let dayType: DayType = "schoolDay";
    if (regionalHoliday) {
        dayType = "holiday";
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayType = "weekend";
    } else if (schoolHolidayRange) {
        dayType = "schoolHoliday";
    } else {
        dayType = "schoolDay";
    }

    const dayPhase = getDayPhase(hour);
    const uiMode = getUiMode(hour, dayType); // Default heuristic

    return {
        date: dateStr,
        time: timeStr,
        dayPhase,
        dayType,
        regionalHoliday,
        schoolHolidayRange,
        uiMode,
        presence: {
            home: true, // Mock default
        },
    };
}
