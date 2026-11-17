import { useId, useState } from "react";
import { ChevronDown, Cloud } from "lucide-react";
import { defaultProvince, provinces, type Province } from "@/config/weather";
import { useCurrentWeather } from "@/hooks/useCurrentWeather";
import { weatherIcon } from "@/lib/weather-icon";
import { useLocale } from "@/i18n";
export function WeatherWidget(_props: { compact?: boolean }) {
  const [province, setProvince] = useState<Province>(defaultProvince);
  const weather = useCurrentWeather(province);
  const selectId = useId();
  const { locale } = useLocale();
  const vi = locale === "vi";
  return (
    <div className="weather-update">
      {weather.status === "ready" ? (
        <img
          className="weather-icon"
          src={weatherIcon(weather.data.code, weather.data.isDay)}
          alt=""
          width="64"
          height="64"
        />
      ) : (
        <Cloud className="weather-icon weather-icon-placeholder" aria-hidden="true" />
      )}
      <div className="weather-city">
        <div className="weather-city-picker">
          <label className="sr-only" htmlFor={selectId}>
            {vi ? "Chọn tỉnh thành" : "Choose city"}
          </label>
          <select
            id={selectId}
            style={{ width: `calc(${province.name.length}ch + 20px)` }}
            value={province.name}
            onChange={(event) =>
              setProvince(provinces.find((p) => p.name === event.target.value) ?? defaultProvince)
            }
          >
            {provinces.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          <ChevronDown size={12} aria-hidden="true" />
        </div>
        <div className="weather-readings" role="status" aria-live="polite">
          {weather.status === "loading" && <span>{vi ? "Đang tải..." : "Loading..."}</span>}
          {weather.status === "error" && <span>{vi ? "Không có dữ liệu" : "Unavailable"}</span>}
          {weather.status === "ready" && (
            <>
              <span aria-label={vi ? "Nhiệt độ" : "Temperature"}>
                {Math.round(weather.data.temperature)}°C
              </span>
              <span className="weather-reading-divider" aria-hidden="true">
                ·
              </span>
              <span aria-label={vi ? "Độ ẩm" : "Humidity"}>
                {Math.round(weather.data.humidity)}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
