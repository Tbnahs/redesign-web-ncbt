import { useState } from 'react';
import { ChevronDown, Droplets, Thermometer } from 'lucide-react';
import { defaultProvince, provinces, type Province } from '@/config/weather';
import { useCurrentWeather } from '@/hooks/useCurrentWeather';

export function WeatherWidget() {
  const [province, setProvince] = useState<Province>(defaultProvince);
  const weather = useCurrentWeather(province);

  const handleProvinceChange = (name: string) => {
    setProvince(provinces.find((p) => p.name === name) ?? defaultProvince);
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm">
      <div className="relative flex items-center">
        <label className="sr-only" htmlFor="weather-province">
          Chọn tỉnh thành
        </label>
        <select
          id="weather-province"
          value={province.name}
          onChange={(event) => handleProvinceChange(event.target.value)}
          className="cursor-pointer appearance-none bg-transparent pr-5 font-bold text-navy-900 focus:outline-none"
        >
          {provinces.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-neutral-500" aria-hidden="true" />
      </div>

      <span className="h-6 w-px bg-neutral-200" aria-hidden="true" />

      {weather.status === 'loading' && <span className="text-neutral-500">Đang tải...</span>}
      {weather.status === 'error' && <span className="text-neutral-500">Không có dữ liệu</span>}
      {weather.status === 'ready' && (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold text-primary-600">
            <Thermometer className="h-4 w-4" aria-hidden="true" />
            {Math.round(weather.data.temperature)}°C
          </span>
          <span className="flex items-center gap-1 text-neutral-700">
            <Droplets className="h-4 w-4 text-primary-500" aria-hidden="true" />
            {Math.round(weather.data.humidity)}%
          </span>
        </div>
      )}
    </div>
  );
}
