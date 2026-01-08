"use client";
import React, { useState, useEffect } from 'react';

export default function OrientationHeader() {
    // Basic clock state
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <header className="h-16 flex items-center bg-[var(--surface-dark)] border-b border-[var(--border)] px-4 md:px-6 select-user-none">
            {/* Left: Valur Identity Anchor */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--valur-red)] rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20 text-white font-bold text-xl">
                    V
                </div>
                <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)] hidden md:block">
                    Valur FamilyHub
                </h1>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right: Temporal Orientation */}
            <div className="flex flex-col items-end text-right">
                <div className="text-2xl font-medium leading-none text-[var(--text-primary)] font-variant-numeric tabular-nums">
                    {formatTime(time)}
                </div>
                <div className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-1">
                    {formatDate(time)}
                </div>
            </div>
        </header>
    );
}
