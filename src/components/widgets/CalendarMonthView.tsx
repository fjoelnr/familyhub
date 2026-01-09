"use client";
import React from 'react';
import { mockEvents } from '@/lib/data/mockCalendar';

export default function CalendarMonthView() {
    // Determine "Today" (mocked as 2026-01-08)
    const todayStr = "2026-01-08";

    // State for selected event overlay
    const [selectedEvent, setSelectedEvent] = React.useState<any>(null);

    // Helper to check if a date string matches a day in grid
    const getEventsForDay = (dateStr: string) => {
        return mockEvents.filter(e => e.date === dateStr);
    };

    // Generate Calendar Grid (Jan 2026)
    // 1st Jan 2026 is Thursday. 
    // Start grid from Mon Dec 29 2025? No, let's keep it simple fixed grid like before but slightly aligned.
    // Jan 2026: 
    // Mo Tu We Th Fr Sa Su
    //           1  2  3  4
    //  5  6  7  8  9 10 11
    // ...

    // We will generate 35 days (5 rows) starting from Dec 29 to Jan 31 + 1 (Feb 1)
    // Actually let's just use the previous logic but map it correctly
    const days = Array.from({ length: 35 }, (_, i) => {
        // Offset: Jan 1 is index 3 (0=Mon, 1=Tue, 2=Wed, 3=Thu)
        // So index 0 should be Dec 29 (-2)
        const dayOffset = i - 2;
        const isJan = dayOffset >= 1 && dayOffset <= 31;
        const dateNum = isJan ? dayOffset : (dayOffset <= 0 ? 31 + dayOffset : dayOffset - 31);

        // Construct basic date string for matching (very naive for this mock)
        // If > 0 it is Jan 2026
        const simpleDateStr = isJan
            ? `2026-01-${dateNum.toString().padStart(2, '0')}`
            : `2025-12-${dateNum.toString().padStart(2, '0')}`; // Ignore Feb for now

        const isToday = simpleDateStr === todayStr;

        return {
            date: dateNum,
            fullDate: simpleDateStr,
            isCurrentMonth: isJan,
            isToday: isToday,
            events: getEventsForDay(simpleDateStr)
        };
    });

    return (
        <div className="flex flex-col h-full bg-[var(--surface-dark)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface-highlight)]/20">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Januar 2026</h2>
                    <span className="text-sm text-[var(--text-secondary)] font-medium">KW 2</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400">❮</button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400">❯</button>
                </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 border-b border-[var(--border)] text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider text-center py-2 bg-[var(--surface-dark)]">
                <div>Mo</div>
                <div>Di</div>
                <div>Mi</div>
                <div>Do</div>
                <div>Fr</div>
                <div>Sa</div>
                <div>So</div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-[var(--border)] gap-px">
                {days.map((d, idx) => (
                    <div
                        key={idx}
                        className={`
                            relative bg-[var(--surface-dark)] p-2 min-h-[80px] hover:bg-[var(--surface-highlight)]/10 transition-colors
                            ${!d.isCurrentMonth ? 'opacity-40' : ''}
                            ${d.isToday ? 'bg-[var(--surface-highlight)]/20' : ''}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`
                                text-sm font-medium 
                                ${d.isToday
                                    ? 'text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 rounded-full'
                                    : 'text-[var(--text-secondary)]'}
                            `}>
                                {d.date}
                            </span>
                        </div>

                        <div className="space-y-1">
                            {d.events.map((e, i) => (
                                <button key={i}
                                    onClick={() => setSelectedEvent(e)}
                                    className={`
                                        w-full text-left text-[10px] px-1.5 py-0.5 rounded text-white truncate font-medium 
                                        ${e.color} shadow-sm opacity-90 hover:opacity-100 hover:scale-[1.02] transform transition-all cursor-pointer
                                        ${e.contextTag ? 'ring-2 ring-offset-1 ring-offset-[#1E1E2E] ring-orange-400/70 z-10' : ''}
                                    `}
                                >
                                    {e.title}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Event Overlay */}
            {selectedEvent && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setSelectedEvent(null)}>
                    <div className="bg-[var(--surface-dark)] border border-[var(--border)] rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4"
                        onClick={e => e.stopPropagation()}>

                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{selectedEvent.title}</h3>
                            <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                                <span>📅</span>
                                <span>{selectedEvent.date}</span>
                            </div>
                            {selectedEvent.time && (
                                <div className="flex items-center gap-2">
                                    <span>⏰</span>
                                    <span>{selectedEvent.time}</span>
                                </div>
                            )}
                            <div className="pt-2">
                                <span className={`inline-block px-2 py-0.5 rounded textxs font-medium text-white ${selectedEvent.color}`}>
                                    Event
                                </span>
                            </div>
                        </div>

                        {selectedEvent.contextTag && (
                            <div className="mt-2 pt-2 border-t border-[var(--border)]">
                                <span className="text-xs text-orange-400 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                    Relevance: {selectedEvent.contextTag}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
