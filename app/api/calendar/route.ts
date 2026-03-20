import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.GATEWAY_CALENDAR_URL || 'http://192.168.178.30:18790';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // Format dates as RFC3339 for Google Calendar API
    const start = startParam 
        ? new Date(startParam).toISOString()
        : new Date().toISOString();
    const end = endParam 
        ? new Date(endParam).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    try {
        const res = await fetch(`${GATEWAY_URL}/api/calendar?start=${start}&end=${end}`);
        if (!res.ok) throw new Error('Gateway error');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Calendar Gateway Error:", error);
        return NextResponse.json({ error: 'Failed to fetch events from gateway' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${GATEWAY_URL}/api/calendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Gateway error');
        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Calendar Create Error:", error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${GATEWAY_URL}/api/calendar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Gateway error');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Calendar Update Error:", error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const calendarId = searchParams.get('calendarId');

    if (!id || !calendarId) {
        return NextResponse.json({ error: 'ID and calendarId required' }, { status: 400 });
    }

    try {
        const res = await fetch(`${GATEWAY_URL}/api/calendar`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventId: id, calendarId })
        });
        if (!res.ok) throw new Error('Gateway error');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Calendar Delete Error:", error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}