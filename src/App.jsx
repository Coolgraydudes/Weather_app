import { useEffect, useState } from "react";
import axios from "./api/axios";

function WeatherIcon({ type }) {
  switch (type) {
    case "Clear":
      return (
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
          <g stroke="white" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
          </g>
        </svg>
      );

    case "Clouds":
      return (
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
          <path
            d="M5 16h13a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4 4 0 0 0-2 9z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      );

    case "Rain":
      return (
        <svg width="80" height="80" fill="none" viewBox="0 0 24 24">
          <path
            d="M5 14h13a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4 4 0 0 0-2 9z"
            stroke="white"
            strokeWidth="2"
          />
          <line x1="8" y1="18" x2="8" y2="22" stroke="white" strokeWidth="2" />
          <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" />
          <line x1="16" y1="18" x2="16" y2="22" stroke="white" strokeWidth="2" />
        </svg>
      );

    default:
      return null;
  }
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
      console.log("Error:", error);
      alert("Kota tidak ditemukan!");
    }
  };

  useEffect(() => {
    fetchWeather("Jakarta");
  }, []);

  const searchLocation = async (event) => {
    if (event.key === "Enter" && location.trim() !== "") {
      fetchWeather(location);
      setLocation("");
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-10">
      
      {/* Search */}
      <div className="text-center p-4">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Masukkan Nama Kota (Contoh: Jakarta)..."
          className="p-4 w-80 rounded-2xl w-[500px] bg-white/10 border border-white/20 outline-none focus:border-blue-400 transition-all"
        />
      </div>

      {/* Weather */}
      {data.name && (
        <div className="mt-5 w-[500px] bg-white/5 p-10 rounded-3xl border border-white/10 shadow-xl text-center transition-all duration-300">

          <h1 className="text-3xl font-light tracking-widest">
            {data.name}
          </h1>

          {/* SVG ICON */}
          <div className="flex justify-center my-6 opacity-90">
            <WeatherIcon type={data.weather[0].main} />
          </div>

          <h2 className="text-7xl font-bold">
            {data.main?.temp.toFixed()}°C
          </h2>

          <p className="mt-3 text-blue-300 uppercase tracking-widest">
            {data.weather[0].main}
          </p>

          <div className="flex justify-between gap-10 mt-10 p-4 border-t border-white/10">
            <div>
              <p className="text-gray-400 text-sm">Kelembapan</p>
              <p className="font-bold">{data.main?.humidity}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Angin</p>
              <p className="font-bold">{data.wind?.speed} m/s</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;
