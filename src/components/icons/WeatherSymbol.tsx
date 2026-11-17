import { weatherIcon } from "@/lib/weather-icon";
export function WeatherSymbol({ code, isDay = true }: { code?: number; isDay?: boolean }) {
  return (
    <span className="weather-symbol" aria-hidden="true">
      {code === 0 && isDay ? (
        <svg className="weather-simple-sun" viewBox="0 0 48 48" focusable="false">
          <circle cx="24" cy="24" r="13.5" fill="#f5b742" />
          <path
            d="M24 2v3M24 43v3M2 24h3M43 24h3M8.4 8.4l2.2 2.2M37.4 37.4l2.2 2.2M8.4 39.6l2.2-2.2M37.4 10.6l2.2-2.2"
            fill="none"
            stroke="#f5b742"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <img src={weatherIcon(code, isDay)} alt="" width="64" height="64" />
      )}
    </span>
  );
}
