import { useEffect, useState } from "react";
import axios from "./api/axios";

function WeatherIcon({ type }) {
  const gradientId = "iconGradient";

  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>

      {type === "Clear" && (
        <>
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
          />
          <g stroke={`url(#${gradientId})`} strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
          </g>
        </>
      )}

      {type === "Clouds" && (
        <path
          d="M5 16h13a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4 4 0 0 0-2 9z"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
        />
      )}

      {type === "Rain" && (
        <>
          <path
            d="M5 14h13a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4 4 0 0 0-2 9z"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
          />
          <g stroke={`url(#${gradientId})`} strokeWidth="2">
            <line x1="8" y1="18" x2="8" y2="22" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="16" y1="18" x2="16" y2="22" />
          </g>
        </>
      )}
    </svg>
  );
}

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setData(response.data);
    } catch (error) {
      alert("Kota tidak ditemukan!");
    }
  };

  useEffect(() => {
    fetchWeather("Jakarta");
  }, []);

  const searchLocation = (event) => {
    if (event.key === "Enter" && location.trim() !== "") {
      fetchWeather(location);
      setLocation("");
    }
  };

  useEffect

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white flex flex-col items-center justify-center px-6">

      {/* Soft Glow Background */}
      <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-purple-500/20 blur-3xl rounded-full bottom-0 right-0"></div>

      <div className="relative z-10 w-full max-w-md">

        {/* Title */}
        <h1 className="text-center text-4xl font-extralight tracking-[0.3em] mb-12 opacity-80">
          WEATHER
        </h1>

        {/* Search */}
        <div className="relative mb-10">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={searchLocation}
            placeholder="Search city..."
            className="w-full p-4 pl-12 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all"
          />
          <svg
            className="absolute left-4 top-4 opacity-50"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Weather Card */}
        {data.name && (
          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-2xl text-center transition-all duration-500 hover:shadow-blue-500/20">

            <h2 className="text-2xl font-light tracking-widest text-gray-300">
              {data.name}
            </h2>

            <div className="flex justify-center my-8">
              <WeatherIcon type={data.weather[0].main} />
            </div>

            <h3 className="text-8xl font-thin tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {data.main?.temp.toFixed()}°
            </h3>

            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-gray-400">
              {data.weather[0].main}
            </p>

            <div className="flex justify-between mt-12 pt-6 border-t border-white/10 text-sm">

              <div className="text-center">
                <p className="text-gray-500 uppercase text-xs tracking-widest">
                  Humidity
                </p>
                <p className="text-lg font-light">
                  {data.main?.humidity}%
                </p>
              </div>

              <div className="text-center">
                <p className="text-gray-500 uppercase text-xs tracking-widest">
                  Wind
                </p>
                <p className="text-lg font-light">
                  {data.wind?.speed} m/s
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
