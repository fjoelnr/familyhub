import { NextRequest, NextResponse } from 'next/server';
import { CalendarSync } from '@/lib/api/calendarSync';

const calendarService = new CalendarSync();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Default to today/next 7 days if not provided
    const start = startParam ? new Date(startParam) : new Date();
    const end = endParam ? new Date(endParam) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
        const events = await calendarService.getEvents(start, end);
        return NextResponse.json(events);
    } catch (error) {
        console.error("Calendar API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newEvent = await calendarService.createEvent(body);
        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error("Calendar Create Error:", error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        
        const updatedEvent = await calendarService.updateEvent(body.id, body);
        return NextResponse.json(updatedEvent);
    } catch (error) {
         console.error("Calendar Update Error:", error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await calendarService.deleteEvent(id);
        return NextResponse.json({ success: true });
    } catch (error) {
         console.error("Calendar Delete Error:", error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
