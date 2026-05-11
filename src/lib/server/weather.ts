/**
 * lib/server/weather.ts
 * ─────────────────────────────────────────────────────────────────
 * Server-side OpenWeather API service for Orbit OS.
 *
 * SECURITY: OPENWEATHER_API_KEY stays in process.env (server only).
 * Usage: import only from Next.js Route Handlers (/api/weather/*)
 * ─────────────────────────────────────────────────────────────────
 */

/* ── Types ──────────────────────────────────────────────────────── */
export interface WeatherParams {
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

export interface WeatherResponse {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  emoji: string;
  source: 'openweather' | 'mock-fallback';
}

/* ── Emoji mapper ───────────────────────────────────────────────── */
function conditionEmoji(main: string): string {
  const map: Record<string, string> = {
    Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌁',
    Haze: '🌫️', Dust: '💨', Sand: '💨', Ash: '🌋',
    Squall: '💨', Tornado: '🌪️',
  };
  return map[main] ?? '🌡️';
}

/* ── Mock fallback ──────────────────────────────────────────────── */
function getMockWeather(city: string): WeatherResponse {
  return {
    location: city,
    temperature: 19,
    feelsLike: 17,
    condition: 'Clouds',
    description: 'partly cloudy',
    humidity: 62,
    windSpeed: 3.2,
    icon: '02n',
    emoji: '⛅',
    source: 'mock-fallback',
  };
}

/* ── Main export ─────────────────────────────────────────────────── */
export async function getCurrentWeather(params: WeatherParams = {}): Promise<WeatherResponse> {
  const apiKey      = process.env.OPENWEATHER_API_KEY;
  const defaultCity = process.env.OPENWEATHER_DEFAULT_CITY ?? 'Ankara';
  const defaultCountry = process.env.OPENWEATHER_DEFAULT_COUNTRY ?? 'TR';

  const city    = params.city    ?? defaultCity;
  const country = params.country ?? defaultCountry;

  if (!apiKey) {
    console.info('[Weather] No API key configured — returning mock fallback');
    return getMockWeather(city);
  }

  try {
    // Build the API URL — prefer lat/lon for precision, fall back to city name
    let url: string;
    if (params.lat !== undefined && params.lon !== undefined) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${country}&appid=${apiKey}&units=metric`;
    }

    const res  = await fetch(url, { next: { revalidate: 600 } }); // cache 10 min
    if (!res.ok) {
      throw new Error(`OpenWeather HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json() as {
      name: string;
      main: { temp: number; feels_like: number; humidity: number };
      weather: Array<{ main: string; description: string; icon: string }>;
      wind: { speed: number };
    };

    const w = data.weather[0];
    return {
      location:    data.name,
      temperature: Math.round(data.main.temp),
      feelsLike:   Math.round(data.main.feels_like),
      condition:   w.main,
      description: w.description,
      humidity:    data.main.humidity,
      windSpeed:   data.wind.speed,
      icon:        w.icon,
      emoji:       conditionEmoji(w.main),
      source:      'openweather',
    };
  } catch (err) {
    console.error('[Weather] Error fetching weather:', err);
    return getMockWeather(city);
  }
}
