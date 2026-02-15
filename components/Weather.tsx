"use client";
import { useEffect, useState } from "react";
import { fetchWeatherOpenMeteo } from "../lib/fetchWeather";
import { getWeatherIcon } from "../utils/getWeatherIcon";

interface WeatherProps {
  lat: number;
  lon: number;
}

export default function Weather({ lat, lon }: WeatherProps) {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherOpenMeteo(lat, lon)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [lat, lon]);

  if (error) return <div className="text-red-400">Fehler: {error}</div>;
  if (!data) return <div>Lade Wetter…</div>;

  const { current_weather, daily } = data;
  const iconSrc = getWeatherIcon(current_weather.weathercode, true);

  return (
    <div className="p-4 bg-gray-800/70 rounded-xl shadow-lg text-gray-100 space-y-6">
      {/* Aktuelles Wetter */}
      <div className="flex items-center gap-4">
        <img src={iconSrc} alt="weather icon" className="w-16 h-16" />
        <div>
          <div className="text-3xl font-bold">{Math.round(current_weather.temperature)}°C</div>
          <div className="capitalize">Wettercode: {current_weather.weathercode}</div>
          <div className="text-sm mt-1">
            Wind: {Math.round(current_weather.windspeed)} km/h
          </div>
        </div>
      </div>

      {/* 7-Tage Forecast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {daily.time.map((day: string, idx: number) => {
          const code = daily.weathercode[idx];
          const dayIcon = getWeatherIcon(code, true);
          return (
            <div key={idx} className="p-2 bg-gray-800/50 rounded text-gray-100 flex flex-col items-center text-sm">
              <div>{new Date(day).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              <img src={dayIcon} alt="day weather icon" className="w-10 h-10 my-1" />
              <div className="font-medium">
                {Math.round(daily.temperature_2m_max[idx])}° / {Math.round(daily.temperature_2m_min[idx])}°
              </div>
              {daily.precipitation_sum && daily.precipitation_sum[idx] > 0 && (
                <div>🌧️ {daily.precipitation_sum[idx]} mm</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
