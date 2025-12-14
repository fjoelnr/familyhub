import { NextResponse } from 'next/server';
import { WeatherResponse } from '@/lib/contracts/api';

/**
 * GET /api/weather
 * Returns current weather and forecast.
 * Currently uses mock data.
 */
export async function GET() {
    try {
        // TODO: Connect to real weather API (e.g. OpenWeatherMap, WeatherAPI)
        // const apiKey = process.env.WEATHER_API_KEY; 
        // const res = await fetch(`...`);

        const mockWeather: WeatherResponse = {
            locationName: "New York",
            temperature: 72,
            condition: "Partly Cloudy",
            icon: "partly-cloudy-day", // Mapping to internal icon set
            forecast: [
                {
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    high: 75,
                    low: 65,
                    condition: "Sunny",
                    icon: "clear-day"
                },
                {
                    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                    high: 70,
                    low: 62,
                    condition: "Cloudy",
                    icon: "cloudy"
                },
                {
                    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                    high: 68,
                    low: 60,
                    condition: "Rain",
                    icon: "rain"
                }
            ]
        };

        return NextResponse.json(mockWeather);
    } catch (error) {
        console.error("Error fetching weather:", error);
        return NextResponse.json(
            { error: "Failed to fetch weather data" },
            { status: 500 }
        );
    }
}
