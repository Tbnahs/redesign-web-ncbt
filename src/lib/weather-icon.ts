// WMO codes: https://open-meteo.com/en/docs
// Weather artwork: https://openweathermap.org/weather-conditions
export function weatherIcon(code: number | undefined, isDay = true): string {
  let icon = "03";
  if (code === 0) icon = "01";
  else if (code === 1) icon = "02";
  else if (code === 2) icon = "03";
  else if (code === 3) icon = "04";
  else if (code === 45 || code === 48) icon = "50";
  else if (code !== undefined && code >= 95) icon = "11";
  else if (code !== undefined && ((code >= 71 && code <= 77) || code === 85 || code === 86))
    icon = "13";
  else if (code !== undefined && code >= 80 && code <= 82) icon = "09";
  else if (code !== undefined && code >= 51 && code <= 67) icon = "10";
  return `/weather/${icon}${isDay ? "d" : "n"}.png`;
}
