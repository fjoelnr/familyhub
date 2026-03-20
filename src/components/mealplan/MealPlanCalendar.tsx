"use client";

import { useEffect, useState } from "react";
import type { MealPlan, MealSlotType } from "@/lib/contracts/food/mealplan";

const SLOT_CONFIG: { type: MealSlotType; label: string; icon: string; color: string }[] = [
    { type: "breakfast", label: "Frühstück", icon: "🌅", color: "amber" },
    { type: "lunch", label: "Mittagessen", icon: "☀️", color: "orange" },
    { type: "dinner", label: "Abendessen", icon: "🌙", color: "indigo" },
    { type: "snack", label: "Snack", icon: "🍪", color: "pink" },
];

const SLOT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" },
};

const WEEKDAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

interface MealPlanCalendarProps {
    onSelectRecipe?: (recipeId: string) => void;
}

export default function MealPlanCalendar({ onSelectRecipe }: MealPlanCalendarProps) {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/mealplan")
            .then((res) => {
                if (!res.ok) throw new Error("Fehler beim Laden des Essensplans");
                return res.json();
            })
            .then((data: MealPlan) => {
                setMealPlan(data);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message);
                setLoading(false);
            });
    }, []);

    const formatDayHeader = (dateStr: string): { weekday: string; date: string; isToday: boolean } => {
        const d = new Date(dateStr + "T00:00:00");
        const today = new Date();
        const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
        const dayIndex = (d.getDay() + 6) % 7; // Monday = 0
        return {
            weekday: WEEKDAY_NAMES[dayIndex],
            date: `${d.getDate()}.${d.getMonth() + 1}.`,
            isToday,
        };
    };

    if (error) {
        return (
            <div className="p-6 bg-red-900/30 border border-red-500/30 rounded-2xl text-red-300">
                <span className="text-lg font-semibold">⚠️ Fehler</span>
                <p className="mt-1 text-sm">{error}</p>
            </div>
        );
    }

    if (loading || !mealPlan) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-gray-800/40 rounded-xl w-48" />
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(28)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-800/40 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
                    📅 Essensplan
                </h2>
                <span className="text-sm text-gray-400">
                    KW {getWeekNumber(mealPlan.weekStart || "")}
                </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {SLOT_CONFIG.map((slot) => {
                    const colors = SLOT_COLORS[slot.color];
                    return (
                        <span
                            key={slot.type}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.border} border ${colors.text}`}
                        >
                            {slot.icon} {slot.label}
                        </span>
                    );
                })}
            </div>

            {/* Desktop: Grid View */}
            <div className="hidden lg:block">
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
                    {/* Day Headers */}
                    <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-700/30">
                        <div className="p-3" />
                        {mealPlan.days?.map((day) => {
                            const { weekday, date, isToday } = formatDayHeader(day.date);
                            return (
                                <div
                                    key={day.date}
                                    className={`p-3 text-center border-l border-gray-700/20 ${isToday ? "bg-violet-500/10" : ""
                                        }`}
                                >
                                    <div
                                        className={`text-sm font-bold ${isToday ? "text-violet-400" : "text-gray-300"}`}
                                    >
                                        {weekday}
                                    </div>
                                    <div
                                        className={`text-xs ${isToday ? "text-violet-400/70" : "text-gray-500"}`}
                                    >
                                        {date}
                                    </div>
                                    {isToday && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mx-auto mt-1" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Slot Rows */}
                    {SLOT_CONFIG.map((slotCfg) => {
                        const colors = SLOT_COLORS[slotCfg.color];
                        return (
                            <div
                                key={slotCfg.type}
                                className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-700/20 last:border-b-0"
                            >
                                {/* Slot Label */}
                                <div className="p-3 flex items-center gap-2 text-sm text-gray-400">
                                    <span>{slotCfg.icon}</span>
                                    <span className="hidden xl:inline">{slotCfg.label}</span>
                                </div>

                                {/* Day Cells */}
                                {mealPlan.days?.map((day) => {
                                    const slot = day.slots.find((s) => s.type === slotCfg.type);
                                    const hasRecipe = slot?.recipeId && slot?.recipeTitle;
                                    const { isToday } = formatDayHeader(day.date);

                                    return (
                                        <div
                                            key={`${day.date}-${slotCfg.type}`}
                                            className={`p-2 border-l border-gray-700/20 min-h-[60px] flex items-center justify-center
                        ${isToday ? "bg-violet-500/5" : ""}`}
                                        >
                                            {hasRecipe ? (
                                                <button
                                                    onClick={() => onSelectRecipe?.(slot!.recipeId!)}
                                                    className={`w-full p-2 rounded-lg text-xs font-medium text-left transition-all duration-200
                            ${colors.bg} ${colors.border} border ${colors.text}
                            hover:scale-[1.02] active:scale-[0.98]`}
                                                >
                                                    {slot!.recipeTitle}
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-8 h-8 rounded-lg border border-dashed border-gray-700/40 flex items-center justify-center
                                     text-gray-600 hover:border-gray-500 hover:text-gray-400 transition-all duration-200"
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile: Stacked Day Cards */}
            <div className="lg:hidden space-y-3">
                {mealPlan.days?.map((day) => {
                    const { weekday, date, isToday } = formatDayHeader(day.date);
                    const filledSlots = day.slots.filter((s) => s.recipeId);

                    return (
                        <div
                            key={day.date}
                            className={`p-4 bg-gray-800/60 backdrop-blur-sm border rounded-2xl shadow-lg shadow-black/20
                ${isToday ? "border-violet-500/30 ring-1 ring-violet-500/10" : "border-gray-700/30"}`}
                        >
                            {/* Day Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <span
                                    className={`text-lg font-bold ${isToday ? "text-violet-400" : "text-gray-300"}`}
                                >
                                    {weekday}
                                </span>
                                <span className={`text-sm ${isToday ? "text-violet-400/70" : "text-gray-500"}`}>
                                    {date}
                                </span>
                                {isToday && (
                                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-violet-500/20 text-violet-400">
                                        Heute
                                    </span>
                                )}
                            </div>

                            {/* Meal Slots */}
                            <div className="space-y-2">
                                {SLOT_CONFIG.map((slotCfg) => {
                                    const slot = day.slots.find((s) => s.type === slotCfg.type);
                                    const hasRecipe = slot?.recipeId && slot?.recipeTitle;
                                    const colors = SLOT_COLORS[slotCfg.color];

                                    return (
                                        <div
                                            key={slotCfg.type}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="text-sm w-6 text-center">{slotCfg.icon}</span>
                                            {hasRecipe ? (
                                                <button
                                                    onClick={() => onSelectRecipe?.(slot!.recipeId!)}
                                                    className={`flex-1 p-2.5 rounded-lg text-sm font-medium text-left transition-all duration-200
                            ${colors.bg} ${colors.border} border ${colors.text}
                            hover:scale-[1.01] active:scale-[0.99]`}
                                                >
                                                    {slot!.recipeTitle}
                                                </button>
                                            ) : (
                                                <div className="flex-1 p-2.5 rounded-lg border border-dashed border-gray-700/30 text-gray-600 text-sm">
                                                    —
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getWeekNumber(dateStr: string): number {
    const d = new Date(dateStr + "T00:00:00");
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
        )
    );
}
