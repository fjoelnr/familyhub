/**
 * @jest-environment node
 */
import { GET, POST, PUT, DELETE } from '@/app/api/calendar/route';

// We switch to node environment for API tests usually, but let's see. 
// If we use 'next/server' NextResponse, it works in Node too.
// We'll use the Request global which is available in Node 18+ or polyfilled.

describe('Calendar API', () => {
    // Basic valid event payload
    const mockEventPayload = {
        title: 'New API Event',
        start: '2023-01-01T10:00:00Z',
        end: '2023-01-01T11:00:00Z',
        allDay: false,
        calendar: 'test',
        source: 'api'
    };

    it('GET returns a list of events', async () => {
        const response = await GET();
        const data = await response.json();

        // Initial state is empty or as defined in the file
        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
    });

    it('POST adds a new event', async () => {
        // Create a mock Request
        const req = new Request('http://localhost/api/calendar', {
            method: 'POST',
            body: JSON.stringify(mockEventPayload)
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.title).toBe(mockEventPayload.title);
        expect(data.id).toBeTruthy(); // Should have generated an ID
    });

    it('PUT updates an event (stub)', async () => {
        const req = new Request('http://localhost/api/calendar', {
            method: 'PUT',
            body: JSON.stringify({ ...mockEventPayload, id: '123', title: 'Updated' })
        });

        const response = await PUT(req);
        const data = await response.json();

        expect(data.title).toBe('Updated');
    });

    it('DELETE removes an event (stub)', async () => {
        const req = new Request('http://localhost/api/calendar?id=123', {
            method: 'DELETE'
        });

        const response = await DELETE(req);
        const data = await response.json();

        expect(data.success).toBe(true);
    });
});
