export type DayPhase =
    | "morning"
    | "afternoon"
    | "evening"
    | "night";

export type DayType =
    | "schoolDay"
    | "weekend"
    | "schoolHoliday"
    | "holiday";

export type UiMode = "calm" | "nerdy" | "manga";

export interface ContextSnapshot {
    date: string; // ISO date string YYYY-MM-DD
    time: string; // ISO time string HH:mm:ss
    dayPhase: DayPhase;
    dayType: DayType;
    regionalHoliday: string | null; // Name of holiday or null
    schoolHolidayRange: { start: string; end: string } | null;
    uiMode: UiMode;
    presence: {
        home: boolean;
        // can be expanded later
    };
}

export interface ContextOptions {
    date?: Date; // Override current time (for testing/SSR)
    locale?: string;
    region?: string; // e.g., "DE-BY"
}
