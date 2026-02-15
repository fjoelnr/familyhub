// utils/getWeatherIcon.ts

// Mapping aus WMO / Open-Meteo weather_code → Icon-Datei
export function getWeatherIcon(code: number, isDay: boolean = true): string {
  switch (code) {
    case 0:
      return "/icons/weather/clear-day.svg";
    case 1:
    case 2:
    case 3:
      return isDay ? "/icons/weather/partly-cloudy-day.svg" : "/icons/weather/partly-cloudy-night.svg";
    case 45:
    case 48:
      return "/icons/weather/fog.svg";
    case 51:
    case 53:
    case 55:
      return "/icons/weather/drizzle.svg";
    case 56:
    case 57:
      return "/icons/weather/drizzle.svg";  // oder frost-drizzle, falls vorhanden
    case 61:
    case 63:
    case 65:
      return "/icons/weather/rain.svg";
    case 66:
    case 67:
      return "/icons/weather/rain.svg";      // freezing rain — ggf. mit eigenem Icon
    case 71:
    case 73:
    case 75:
      return "/icons/weather/snow.svg";
    case 77:
      return "/icons/weather/sleet.svg";
    case 80:
    case 81:
    case 82:
      return "/icons/weather/rain.svg";     // shower rain
    case 85:
    case 86:
      return "/icons/weather/snow.svg";     // snow showers
    case 95:
      return "/icons/weather/thunderstorm.svg";
    // du kannst hier weitere codes mappen, z.B. 96/99 (thunder + hail) etc.
    default:
      return "/icons/weather/not-available.svg";
  }
}
