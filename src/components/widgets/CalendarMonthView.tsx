"use client";
import React from 'react';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
}

interface CalendarMonthViewProps {
    events?: CalendarEvent[];
    currentDate?: Date;
    onMonthChange?: (date: Date) => void;
}

export default function CalendarMonthView({ 
    events = [], 
    currentDate = new Date(),
    onMonthChange 
}: CalendarMonthViewProps) {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    const daysInMonth = lastDayOfMonth.getDate();
    
    const calendarDays: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendarDays.push({
            date: prevMonthLastDay - i,
            month: month - 1,
            year: month === 0 ? year - 1 : year,
            isCurrentMonth: false
        });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
            date: i,
            month: month,
            year: year,
            isCurrentMonth: true
        });
    }
    
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({
            date: i,
            month: month + 1,
            year: month === 11 ? year + 1 : year,
            isCurrentMonth: false
        });
    }

    const getEventsForDay = (day: number, monthIdx: number, yearNum: number) => {
        const dateStr = `${yearNum}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => {
            const eventDate = e.start.split('T')[0];
            return eventDate === dateStr;
        });
    };

    const isToday = (day: number, monthIdx: number, yearNum: number) => {
        return day === today.getDate() && 
               monthIdx === today.getMonth() && 
               yearNum === today.getFullYear();
    };

    const getWeekNumber = (date: Date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const handlePrevMonth = () => {
        if (onMonthChange) {
            onMonthChange(new Date(year, month - 1, 1));
        }
    };

    const handleNextMonth = () => {
        if (onMonthChange) {
            onMonthChange(new Date(year, month + 1, 1));
        }
    };

    const getColorClass = (color?: string) => {
        if (!color) return 'bg-blue-500';
        const colors: Record<string, string> = {
            'red': 'bg-red-500',
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'yellow': 'bg-yellow-500',
            'purple': 'bg-purple-500',
            'orange': 'bg-orange-500',
            'pink': 'bg-pink-500',
            'cyan': 'bg-cyan-500'
        };
        return colors[color.toLowerCase()] || 'bg-blue-500';
    };

    return (
        <div className="flex flex-col h-full bg-[var(--surface-dark)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface-highlight)]/20">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {monthNames[month]} {year}
                    </h2>
                    <span className="text-sm text-[var(--text-secondary)] font-medium">
                        KW {getWeekNumber(new Date(year, month, 15))}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400"
                    >
                        ❮
                    </button>
                    <button 
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400"
                    >
                        ❯
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-[var(--border)] text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider text-center py-2 bg-[var(--surface-dark)]">
                <div>Mo</div>
                <div>Di</div>
                <div>Mi</div>
                <div>Do</div>
                <div>Fr</div>
                <div>Sa</div>
                <div>So</div>
            </div>

            <div className="flex-1 grid grid-cols-7 grid-rows-6 bg-[var(--border)] gap-px">
                {calendarDays.map((d, idx) => {
                    const dayEvents = getEventsForDay(d.date, d.month, d.year);
                    const todayCheck = isToday(d.date, d.month, d.year);
                    
                    return (
                        <div
                            key={idx}
                            className={`
                                relative bg-[var(--surface-dark)] p-2 min-h-[80px] hover:bg-[var(--surface-highlight)]/10 transition-colors
                                ${!d.isCurrentMonth ? 'opacity-40' : ''}
                                ${todayCheck ? 'bg-[var(--surface-highlight)]/20' : ''}
                            `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`
                                    text-sm font-medium 
                                    ${todayCheck
                                        ? 'text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 rounded-full'
                                        : 'text-[var(--text-secondary)]'}
                                `}>
                                    {d.date}
                                </span>
                            </div>

                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((e, i) => (
                                    <div 
                                        key={i} 
                                        className={`text-[10px] px-1.5 py-0.5 rounded text-white truncate font-medium ${getColorClass(e.color)} shadow-sm opacity-90 hover:opacity-100`}
                                    >
                                        {e.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-gray-400">
                                        +{dayEvents.length - 3} mehr
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
