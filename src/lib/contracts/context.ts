export type DayPhase =
    | "early_morning"
    | "morning"
    | "late_morning"
    | "afternoon"
    | "evening"
    | "night";

export type DayType =
    | "school_holiday"
    | "holiday"
    | "weekend"
    | "workday";

export interface ContextSnapshot {
    date: string;
    time: string;
    dayPhase: DayPhase;
    dayType: DayType;
    isHoliday: boolean;
    isSchoolHoliday: boolean;
    region: string;
}
