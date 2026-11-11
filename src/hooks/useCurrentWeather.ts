import { useEffect, useState } from 'react';
import type { Province } from '@/config/weather';


export interface CurrentWeather {
  temperature: number;
  humidity: number;
}

export type WeatherState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: CurrentWeather };

export function useCurrentWeather(province: Province): WeatherState {
  const [state, setState] = useState<WeatherState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${province.latitude}` +
      `&longitude=${province.longitude}&current=temperature_2m,relative_humidity_2m&timezone=auto`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { current?: { temperature_2m?: unknown; relative_humidity_2m?: unknown } }) => {
        const temperature = json.current?.temperature_2m;
        const humidity = json.current?.relative_humidity_2m;
        if (typeof temperature !== 'number' || typeof humidity !== 'number') {
          throw new Error('Invalid weather payload');
        }
        setState({ status: 'ready', data: { temperature, humidity } });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error' });
        console.error(error);
      });

    return () => controller.abort();
  }, [province]);

  return state;
}
