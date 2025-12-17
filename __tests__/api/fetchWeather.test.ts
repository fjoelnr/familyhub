import { fetchWeather } from '@/lib/api/fetchWeather';

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

describe('fetchWeather', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        process.env.OPENWEATHER_API_KEY = 'test-key';
        process.env.USE_MOCK_DATA = 'false';
    });

    it('fetches and normalizes weather data correctly', async () => {
        // Mock Current Weather Response
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
                    main: { temp: 20 },
                    name: 'London',
                }),
            })
            // Mock Forecast Response
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    list: [
                        {
                            dt: 1698235200,
                            main: { temp_max: 22, temp_min: 18 },
                            weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
                        },
                    ],
                    city: { name: 'London' },
                }),
            });

        const data = await fetchWeather('London');

        expect(data.locationName).toBe('London');
        expect(data.temperature).toBe(20);
        expect(data.condition).toBe('Clear');
        expect(data.forecast).toHaveLength(1);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('uses mock data when USE_MOCK_DATA is true', async () => {
        process.env.USE_MOCK_DATA = 'true';
        const data = await fetchWeather('London');
        expect(data.locationName).toBe('Mock City');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns mock data on API failure', async () => {
        // Mock failure
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Down'));

        const data = await fetchWeather('London');
        expect(data.locationName).toBe('Mock City'); // Should fall back
    });
});
