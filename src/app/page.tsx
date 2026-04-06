"use client";

import { useState, useEffect } from "react";

// Weather condition to illustration type mapping
function getWeatherType(code: number): "clear" | "cloudy" | "rainy" | "snowy" | "foggy" {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "cloudy";
  if (code >= 45 && code <= 48) return "foggy";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "rainy";
  if (code >= 85 && code <= 86) return "snowy";
  if (code >= 95) return "rainy";
  return "cloudy";
}

// Check if it's currently night time
function isNightTime(current: Date, sunrise: Date, sunset: Date): boolean {
  return current < sunrise || current > sunset;
}

// Illustrated backgrounds for each weather type
function WeatherIllustration({ type, isNight }: { type: string; isNight: boolean }) {
  const bgColor = isNight ? "#1a2a2a" : "#2d3d3d";
  const mountainColor1 = isNight ? "#0d1a1a" : "#1a2a2a";
  const mountainColor2 = isNight ? "#152222" : "#243434";
  const treeColor = isNight ? "#0a1414" : "#152222";
  const waterColor = isNight ? "#0d1818" : "#1a2828";
  const skyElement = isNight ? (
    // Moon
    <circle cx="200" cy="80" r="25" fill="#c4c4b0" opacity="0.6" />
  ) : (
    // Sun
    <circle cx="200" cy="80" r="30" fill="#e8e4d4" opacity="0.4" />
  );

  // Weather-specific elements
  let weatherOverlay = null;
  if (type === "rainy") {
    weatherOverlay = (
      <g opacity="0.3">
        {[...Array(20)].map((_, i) => (
          <line
            key={i}
            x1={50 + i * 20}
            y1={50 + (i % 3) * 20}
            x2={45 + i * 20}
            y2={80 + (i % 3) * 20}
            stroke="#a8c8d8"
            strokeWidth="1.5"
          />
        ))}
      </g>
    );
  } else if (type === "snowy") {
    weatherOverlay = (
      <g opacity="0.4">
        {[...Array(25)].map((_, i) => (
          <circle
            key={i}
            cx={30 + (i * 37) % 380}
            cy={40 + (i * 23) % 200}
            r="2"
            fill="#e8e8e8"
          />
        ))}
      </g>
    );
  } else if (type === "foggy") {
    weatherOverlay = (
      <g opacity="0.2">
        <rect x="0" y="150" width="400" height="80" fill="#a8b8b8" />
        <rect x="0" y="200" width="400" height="100" fill="#98a8a8" />
      </g>
    );
  } else if (type === "cloudy") {
    weatherOverlay = (
      <g opacity="0.15">
        <ellipse cx="100" cy="60" rx="60" ry="25" fill="#8898a8" />
        <ellipse cx="280" cy="50" rx="70" ry="30" fill="#8898a8" />
        <ellipse cx="180" cy="80" rx="50" ry="20" fill="#8898a8" />
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky gradient */}
      <rect width="400" height="400" fill={bgColor} />

      {/* Sun or Moon */}
      {skyElement}

      {/* Weather overlay */}
      {weatherOverlay}

      {/* Far mountains */}
      <path
        d="M0 280 L80 140 L120 180 L180 100 L220 150 L280 80 L340 160 L400 120 L400 400 L0 400 Z"
        fill={mountainColor2}
      />

      {/* Near mountains */}
      <path
        d="M0 320 L60 220 L100 260 L160 180 L200 230 L260 160 L320 240 L380 200 L400 220 L400 400 L0 400 Z"
        fill={mountainColor1}
      />

      {/* Trees left side */}
      <g fill={treeColor}>
        <path d="M20 400 L30 340 L40 400 Z" />
        <path d="M50 400 L65 320 L80 400 Z" />
        <path d="M35 400 L50 350 L65 400 Z" />
        <path d="M70 400 L85 330 L100 400 Z" />
        <path d="M90 400 L105 345 L120 400 Z" />
      </g>

      {/* Trees right side */}
      <g fill={treeColor}>
        <path d="M300 400 L315 330 L330 400 Z" />
        <path d="M320 400 L340 310 L360 400 Z" />
        <path d="M350 400 L365 340 L380 400 Z" />
        <path d="M370 400 L385 350 L400 400 Z" />
      </g>

      {/* Water */}
      <rect x="0" y="360" width="400" height="40" fill={waterColor} />

      {/* Water reflections */}
      <g opacity="0.1">
        <rect x="120" y="365" width="160" height="2" fill="#4a5a5a" />
        <rect x="140" y="375" width="120" height="1" fill="#4a5a5a" />
        <rect x="160" y="385" width="80" height="1" fill="#4a5a5a" />
      </g>
    </svg>
  );
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  locationName: string;
}

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  useEffect(() => {
    async function fetchWeather(lat: number, lon: number) {
      try {
        // Get location name from reverse geocoding
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const geoData = await geoResponse.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Unknown";
        const country = geoData.address?.country || "";

        // Get weather from Open-Meteo
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          weatherCode: weatherData.current.weather_code,
          sunrise: weatherData.daily.sunrise[0],
          sunset: weatherData.daily.sunset[0],
          locationName: `${city}, ${country}`,
        });
        setLoading(false);
      } catch {
        setError("Couldn't fetch weather data");
        setLoading(false);
      }
    }

    // Try to get user's location, fallback to NYC
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to NYC
          fetchWeather(40.7128, -74.006);
        }
      );
    } else {
      // Fallback to NYC
      fetchWeather(40.7128, -74.006);
    }
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate time until sunrise or sunset
  const getTimeUntilSunEvent = () => {
    if (!weather) return { event: "sunset", time: "--" };

    const now = currentTime;
    const sunrise = new Date(weather.sunrise);
    const sunset = new Date(weather.sunset);

    let targetEvent: "sunrise" | "sunset";
    let targetTime: Date;

    if (now < sunrise) {
      targetEvent = "sunrise";
      targetTime = sunrise;
    } else if (now < sunset) {
      targetEvent = "sunset";
      targetTime = sunset;
    } else {
      // After sunset, show tomorrow's sunrise
      targetEvent = "sunrise";
      targetTime = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000);
    }

    const diffMs = targetTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeString: string;
    if (diffHours > 0) {
      timeString = `${diffHours}h ${diffMins}m`;
    } else {
      timeString = `${diffMins}m`;
    }

    return { event: targetEvent, time: timeString };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="w-[400px] h-[400px] rounded-3xl bg-zinc-800 flex items-center justify-center">
          <p className="text-white/60 text-lg">Loading weather...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="w-[400px] h-[400px] rounded-3xl bg-zinc-800 flex items-center justify-center">
          <p className="text-white/60 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const weatherType = weather ? getWeatherType(weather.weatherCode) : "clear";
  const isNight = weather
    ? isNightTime(currentTime, new Date(weather.sunrise), new Date(weather.sunset))
    : false;
  const sunEvent = getTimeUntilSunEvent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="relative w-[400px] h-[400px] rounded-3xl overflow-hidden shadow-2xl">
        {/* Illustrated background */}
        <WeatherIllustration type={weatherType} isNight={isNight} />

        {/* Content overlay */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex justify-between items-start">
            {/* Date and time */}
            <div className="text-white">
              <p className="text-lg font-medium opacity-90">Today</p>
              <p className="text-2xl font-light">{formatTime(currentTime)}</p>
            </div>

            {/* Temperature */}
            <div className="text-white">
              <p className="text-7xl font-light">{weather?.temperature}°</p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-end">
            {/* Location */}
            <div className="text-white">
              <p className="text-xl font-semibold">{weather?.locationName.split(",")[0]}</p>
              <p className="text-lg opacity-70">{weather?.locationName.split(",")[1]?.trim()}</p>
            </div>

            {/* Sunrise/Sunset */}
            <div className="text-white text-right">
              <p className="text-sm opacity-70">{sunEvent.event === "sunrise" ? "Sunrise in" : "Sunset in"}</p>
              <p className="text-lg font-medium">{sunEvent.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
