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
  const buildingColorFar = isNight ? "#1a2828" : "#2a3a3a";
  const buildingColorMid = isNight ? "#142020" : "#1e2e2e";
  const buildingColorNear = isNight ? "#0d1616" : "#152222";
  const windowColor = isNight ? "#3a4a4a" : "#3d4d4d";
  const skyElement = isNight ? (
    // Moon
    <circle cx="320" cy="70" r="25" fill="#c4c4b0" opacity="0.6" />
  ) : (
    // Sun
    <circle cx="320" cy="70" r="30" fill="#e8e4d4" opacity="0.4" />
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
      {/* Sky */}
      <rect width="400" height="400" fill={bgColor} />

      {/* Sun or Moon */}
      {skyElement}

      {/* Weather overlay */}
      {weatherOverlay}

      {/* Far buildings (background layer) */}
      <g fill={buildingColorFar}>
        <rect x="0" y="220" width="35" height="180" />
        <rect x="40" y="180" width="25" height="220" />
        <rect x="70" y="200" width="30" height="200" />
        <rect x="105" y="160" width="20" height="240" />
        <rect x="130" y="190" width="35" height="210" />
        <rect x="170" y="140" width="25" height="260" />
        <rect x="200" y="170" width="30" height="230" />
        <rect x="235" y="150" width="22" height="250" />
        <rect x="262" y="185" width="28" height="215" />
        <rect x="295" y="165" width="35" height="235" />
        <rect x="335" y="195" width="25" height="205" />
        <rect x="365" y="175" width="35" height="225" />
      </g>

      {/* Mid buildings */}
      <g fill={buildingColorMid}>
        <rect x="-5" y="260" width="40" height="140" />
        <rect x="45" y="230" width="30" height="170" />
        <rect x="85" y="250" width="25" height="150" />
        <rect x="120" y="210" width="35" height="190" />
        <rect x="165" y="240" width="28" height="160" />
        <rect x="200" y="220" width="32" height="180" />
        <rect x="240" y="200" width="25" height="200" />
        <rect x="275" y="235" width="30" height="165" />
        <rect x="315" y="215" width="35" height="185" />
        <rect x="360" y="245" width="45" height="155" />
      </g>

      {/* Near buildings (foreground) */}
      <g fill={buildingColorNear}>
        <rect x="-10" y="300" width="50" height="100" />
        <rect x="50" y="280" width="35" height="120" />
        <rect x="95" y="310" width="40" height="90" />
        <rect x="145" y="270" width="30" height="130" />
        <rect x="185" y="290" width="45" height="110" />
        <rect x="240" y="260" width="35" height="140" />
        <rect x="285" y="285" width="40" height="115" />
        <rect x="335" y="275" width="30" height="125" />
        <rect x="375" y="295" width="30" height="105" />
      </g>

      {/* Window lights (only visible at night) */}
      {isNight && (
        <g fill={windowColor} opacity="0.6">
          {/* Scattered lit windows */}
          <rect x="52" y="235" width="4" height="5" />
          <rect x="60" y="250" width="4" height="5" />
          <rect x="125" y="220" width="4" height="5" />
          <rect x="140" y="235" width="4" height="5" />
          <rect x="172" y="250" width="4" height="5" />
          <rect x="210" y="230" width="4" height="5" />
          <rect x="245" y="210" width="4" height="5" />
          <rect x="255" y="225" width="4" height="5" />
          <rect x="285" y="245" width="4" height="5" />
          <rect x="320" y="225" width="4" height="5" />
          <rect x="340" y="240" width="4" height="5" />
          <rect x="55" y="290" width="4" height="5" />
          <rect x="155" y="285" width="4" height="5" />
          <rect x="200" y="300" width="4" height="5" />
          <rect x="250" y="275" width="4" height="5" />
          <rect x="295" y="295" width="4" height="5" />
          <rect x="345" y="285" width="4" height="5" />
        </g>
      )}

      {/* Ground */}
      <rect x="0" y="385" width="400" height="15" fill={buildingColorNear} />
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
