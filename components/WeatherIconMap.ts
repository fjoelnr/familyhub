// src/components/WeatherIconMap.ts
export const weatherIconMap: Record<string, string> = {
  // klare Himmel / Sonne
  "clear-day": "/icons/weather/clear-day.svg",
  "clear-night": "/icons/weather/clear-night.svg",

  // Bewölkung / Wolken
  "cloudy": "/icons/weather/cloudy.svg",
  "cloud-up": "/icons/weather/cloud-up.svg",
  "cloud-down": "/icons/weather/cloud-down.svg",

  // Wechselhaft, Wolken + Sonne
  "partly-cloudy-day": "/icons/weather/partly-cloudy-day.svg",
  "partly-cloudy-night": "/icons/weather/partly-cloudy-night.svg",

  // Regen / Schnee / Niederschlag
  "rain": "/icons/weather/rain.svg",
  "drizzle": "/icons/weather/drizzle.svg",
  "sleet": "/icons/weather/sleet.svg",
  "snow": "/icons/weather/snow.svg",
  "hail": "/icons/weather/hail.svg",

  // Nebel, Dunst, Staub etc.
  "fog": "/icons/weather/fog.svg",
  "mist": "/icons/weather/mist.svg",
  "dust": "/icons/weather/dust.svg",
  "dust-wind": "/icons/weather/dust-wind.svg",

  // Wind
  "wind": "/icons/weather/wind.svg",
  "umbrella-wind": "/icons/weather/umbrella-wind.svg",

  // Extreme / Unwetter / Warnungen
  "thunderstorm": "/icons/weather/thunderstorm.svg",
  "extreme-day": "/icons/weather/extreme-day.svg",
  "extreme-night": "/icons/weather/extreme-night.svg",
  // ... du kannst hier weitere „extreme-“ etc. je nach Wettercode ergänzen
};
