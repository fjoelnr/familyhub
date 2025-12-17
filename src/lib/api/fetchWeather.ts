import { WeatherData } from '../contracts/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OpenWeatherCurrentResponse {
  weather: { main: string; description: string; icon: string }[];
  main: { temp: number };
  name: string;
}

interface OpenWeatherForecastResponse {
  list: {
    dt: number;
    main: { temp_max: number; temp_min: number };
    weather: { main: string; description: string; icon: string }[];
  }[];
  city: { name: string };
}

/**
 * Fetches current weather and forecast from OpenWeatherMap.
 * Uses Next.js fetch caching (5 minutes).
 */
export async function fetchWeather(location: string | { lat: number; lon: number }): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // 1. Check for Mock Mode
  if (process.env.USE_MOCK_DATA === 'true' || !apiKey) {
    if (!apiKey) console.warn('OPENWEATHER_API_KEY not set. Using mock data.');
    return getMockWeather();
  }

  try {
    const query = typeof location === 'string'
      ? `q=${encodeURIComponent(location)}`
      : `lat=${location.lat}&lon=${location.lon}`;

    // 2. Fetch Current Weather
    const currentRes = await fetch(`${BASE_URL}/weather?${query}&units=metric&appid=${apiKey}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!currentRes.ok) {
      throw new Error(`Weather API Error: ${currentRes.statusText}`);
    }

    const currentData: OpenWeatherCurrentResponse = await currentRes.json();

    // 3. Fetch Forecast (5 day / 3 hour)
    // Note: Free tier doesn't support daily forecast API, so we approximate from 5day/3hour
    const forecastRes = await fetch(`${BASE_URL}/forecast?${query}&units=metric&appid=${apiKey}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    let forecastItems: WeatherData['forecast'] = [];

    if (forecastRes.ok) {
      const forecastData: OpenWeatherForecastResponse = await forecastRes.json();
      // Group by day and get 1 forecast per day (approximate)
      // For simplicity, taking one entry per day (e.g., noon) or just the next 5 entries if daily aggs needed
      // Here we will just map the next 5 distinct days

      const processedDates = new Set<string>();

      forecastItems = forecastData.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!processedDates.has(date) && processedDates.size < 5) {
          processedDates.add(date);
          acc.push({
            date,
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
          });
        }
        return acc;
      }, [] as NonNullable<WeatherData['forecast']>);
    }

    return {
      locationName: currentData.name,
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      icon: currentData.weather[0].icon,
      forecast: forecastItems,
    };

  } catch (error: unknown) {
    console.error('Failed to fetch weather:', error);
    // Fallback to mock data on error so UI doesn't break? 
    // Or rethrow. Let's return mock for now to be "robust" as requested for "offline dev" or error resilience.
    return getMockWeather();
  }
}

function getMockWeather(): WeatherData {
  return {
    locationName: 'Mock City',
    temperature: 22,
    condition: 'Clear',
    icon: '01d',
    forecast: [
      { date: '2023-10-25', high: 24, low: 18, condition: 'Clouds', icon: '03d' },
      { date: '2023-10-26', high: 25, low: 19, condition: 'Rain', icon: '10d' },
      { date: '2023-10-27', high: 21, low: 16, condition: 'Clear', icon: '01d' },
      { date: '2023-10-28', high: 20, low: 15, condition: 'Clouds', icon: '02d' },
      { date: '2023-10-29', high: 22, low: 17, condition: 'Clear', icon: '01d' },
    ],
  };
}
