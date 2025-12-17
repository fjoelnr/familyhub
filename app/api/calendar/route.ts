import { NextRequest, NextResponse } from 'next/server';
import { CalendarEventResponse } from '@/lib/contracts/api';

// In-memory storage placeholder
const events: CalendarEventResponse[] = [
    {
        id: '1',
        title: 'Family Dinner',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        allDay: false,
        calendar: 'Family',
        source: 'local',
        location: 'Dining Room'
    }
];

export async function GET() {
    // TODO: Fetch from database or external Calendar API (Google/Outlook)
    return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.start || !body.end) {
            return NextResponse.json(
                { error: 'Missing required fields: title, start, end' },
                { status: 400 }
            );
        }

        const newEvent: CalendarEventResponse = {
            id: body.id || Math.random().toString(36).substring(7),
            title: body.title,
            start: body.start,
            end: body.end,
            allDay: body.allDay || false,
            calendar: body.calendar || 'Default',
            source: 'local',
            location: body.location,
            attendees: body.attendees || [],
            recurrence: body.recurrence,
        };

        events.push(newEvent);
        // TODO: Persist to database

        return NextResponse.json(newEvent, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.id) {
            return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
        }

        const index = events.findIndex(e => e.id === body.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Merge updates
        events[index] = { ...events[index], ...body };
        // TODO: Update in database

        return NextResponse.json(events[index]);
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const index = events.findIndex(e => e.id === id);
    if (index === -1) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    events.splice(index, 1);
    // TODO: Delete from database

    return NextResponse.json({ success: true });
}
