/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/calendar/route';

describe('Calendar API', () => {
    const fetchMock = jest.fn();

    // Basic valid event payload
    const mockEventPayload = {
        title: 'New API Event',
        start: '2023-01-01T10:00:00Z',
        end: '2023-01-01T11:00:00Z',
        allDay: false,
        calendar: 'test',
        source: 'api'
    };

    beforeEach(() => {
        fetchMock.mockReset();
        global.fetch = fetchMock as typeof fetch;
    });

    it('GET returns a list of events', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify([{ id: '1', title: 'Test Event' }]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const mockRequest = new NextRequest('http://localhost/api/calendar?start=2023-01-01&end=2023-01-31');
        const response = await GET(mockRequest);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(data)).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('POST adds a new event', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ ...mockEventPayload, id: 'generated-id' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const req = new NextRequest('http://localhost/api/calendar', {
            method: 'POST',
            body: JSON.stringify(mockEventPayload)
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.title).toBe(mockEventPayload.title);
        expect(data.id).toBeTruthy();
    });

    it('PUT updates an event (stub)', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ ...mockEventPayload, id: '1', title: 'Updated' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const req = new NextRequest('http://localhost/api/calendar', {
            method: 'PUT',
            body: JSON.stringify({ ...mockEventPayload, id: '1', title: 'Updated' })
        });

        const response = await PUT(req);
        const data = await response.json();

        expect(data.title).toBe('Updated');
    });

    it('DELETE removes an event (stub)', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        );

        const req = new NextRequest('http://localhost/api/calendar?id=1&calendarId=test', {
            method: 'DELETE'
        });

        const response = await DELETE(req);
        const data = await response.json();

        expect(data.success).toBe(true);
    });
});
