'use client';

import { useState, useEffect } from 'react';
import CalendarMonthView from '@/components/widgets/CalendarMonthView';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
}

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        async function fetchEvents() {
            try {
                const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                
                const res = await fetch(`/api/calendar?start=${start.toISOString()}&end=${end.toISOString()}`);
                if (!res.ok) throw new Error('Failed to fetch');
                
                const data = await res.json();
                setEvents(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, [currentDate]);

    return (
        <div className="p-6 h-full">
            <div className="max-w-7xl mx-auto h-full">
                <h1 className="text-3xl font-bold text-stone-800 mb-6">📅 Kalender</h1>
                
                {loading && <p className="text-stone-600">Lade Termine...</p>}
                {error && <p className="text-red-600">Fehler: {error}</p>}
                
                {!loading && !error && (
                    <CalendarMonthView 
                        events={events} 
                        currentDate={currentDate}
                        onMonthChange={setCurrentDate}
                    />
                )}
            </div>
        </div>
    );
}
