import { getContextSnapshot } from "./getContextSnapshot";

describe("getContextSnapshot", () => {
    it("should detect fixed holidays (Christmas)", () => {
        const d = new Date("2025-12-25T10:00:00");
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.regionalHoliday).toBe("1. Weihnachtstag");
        expect(ctx.dayType).toBe("holiday");
    });

    it("should detect Easter-based holidays (Carrot Friday 2025 -> April 18)", () => {
        // Easter 2025 is April 20. Karfreitag is April 18.
        const d = new Date("2025-04-18T10:00:00");
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.regionalHoliday).toBe("Karfreitag");
    });

    it("should detect school holidays (Winter 2024/25)", () => {
        const d = new Date("2024-12-27T10:00:00"); // Inside winter break
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.dayType).toBe("schoolHoliday");
        expect(ctx.schoolHolidayRange).not.toBeNull();
    });

    it("should detect weekends", () => {
        const d = new Date("2025-06-14T10:00:00"); // Saturday
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.dayType).toBe("weekend");
        expect(ctx.uiMode).toBe("manga"); // Default logic for weekends
    });

    it("should assign correct day phase", () => {
        const d = new Date("2025-01-10T08:00:00");
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.dayPhase).toBe("morning");
    });

    it("should set calm mode at night", () => {
        const d = new Date("2025-01-10T23:00:00");
        const ctx = getContextSnapshot({ date: d });
        expect(ctx.dayPhase).toBe("night");
        expect(ctx.uiMode).toBe("calm");
    });
});
