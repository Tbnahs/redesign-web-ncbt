import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Sun } from "lucide-react";
export function WeatherSymbol({ code, isDay = true }: { code?: number; isDay?: boolean }) {
  if (code === 0)
    return (
      <span className="weather-symbol" aria-hidden="true">
        {isDay ? <Sun className="weather-sun" /> : <Moon className="weather-moon" />}
      </span>
    );
  if (code === 1)
    return (
      <span className="weather-symbol" aria-hidden="true">
        {isDay ? <Sun className="weather-sun-detail" /> : <Moon className="weather-moon-detail" />}
        <Cloud className="weather-cloud-front" />
      </span>
    );
  const Icon =
    code === 45 || code === 48
      ? CloudFog
      : code !== undefined && code >= 95
        ? CloudLightning
        : code !== undefined && ((code >= 71 && code <= 77) || code === 85 || code === 86)
          ? CloudSnow
          : code !== undefined && ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
            ? CloudRain
            : Cloud;
  return (
    <span className="weather-symbol" aria-hidden="true">
      <Icon className="weather-cloud" />
    </span>
  );
}
