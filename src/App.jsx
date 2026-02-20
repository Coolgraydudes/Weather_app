import { useState, useEffect } from "react";
import axios from "./api/axios.js";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [history, setHistory] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  // ==========================
  // FETCH WEATHER
  // ==========================
  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      setData(response.data);
      saveHistory(city);
    } catch (error) {
      alert("Kota tidak ditemukan!");
    }
  };

  // ==========================
  // SEARCH ENTER
  // ==========================
  const searchLocation = (event) => {
    if (event.key === "Enter" && location.trim() !== "") {
      fetchWeather(location);
      setLocation("");
    }
  };

  // ==========================
  // SAVE HISTORY
  // ==========================
  const saveHistory = (city) => {
    let updatedHistory = [
      city,
      ...history.filter((item) => item !== city),
    ];

    if (updatedHistory.length > 5) {
      updatedHistory = updatedHistory.slice(0, 5);
    }

    setHistory(updatedHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(updatedHistory));
  };

  // ==========================
  // LOAD LAST SEARCH
  // ==========================
  useEffect(() => {
    const storedHistory = localStorage.getItem("weatherHistory");

    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory);

      if (parsedHistory.length > 0) {
        fetchWeather(parsedHistory[0]);
      }
    } else {
      fetchWeather("Jakarta");
    }
  }, []);

  // ==========================
  // FORMAT TIME
  // ==========================
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* HEADER */}
      <div className="bg-white/5 rounded-3xl p-6 mb-6 border border-white/10 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 19a4 4 0 010-8 5 5 0 019.9-1.1A3.5 3.5 0 1117.5 19H6z" />
          </svg>
          <h1 className="text-2xl tracking-widest font-light">
            Weather Dashboard
          </h1>
        </div>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={searchLocation}
          placeholder="Search for a city..."
          className="p-3 w-64 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-blue-400 transition"
        />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* HISTORY PANEL */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h3 className="text-gray-400 mb-4 text-sm tracking-widest">
            LAST SEARCH
          </h3>

          <div className="flex flex-col gap-3">
            {history.length > 0 ? (
              history.map((city, index) => (
                <button
                  key={index}
                  onClick={() => fetchWeather(city)}
                  className="text-left p-3 bg-white/5 hover:bg-blue-500/20 rounded-xl transition"
                >
                  {city}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Belum ada pencarian</p>
            )}
          </div>
        </div>

        {/* WEATHER PANEL */}
        <div className="md:col-span-2 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">

          {data.name ? (
            <>
              <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* LEFT SIDE */}
                <div>
                  <h2 className="text-3xl font-light tracking-widest">
                    {data.name}
                    <span className="text-blue-400 text-lg ml-2">
                      ({data.sys?.country})
                    </span>
                  </h2>

                  <div className="mt-6">
                    <h1 className="text-8xl font-bold">
                      {data.main?.temp.toFixed()}°C
                    </h1>
                  </div>

                  <p className="mt-4 text-xl text-blue-300 uppercase tracking-widest">
                    {data.weather?.[0]?.main}
                  </p>

                  <p className="text-gray-400 capitalize mt-2">
                    {data.weather?.[0]?.description}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col items-center justify-center gap-6">

                  {data.weather?.[0]?.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                      alt="weather icon"
                      className="w-32 h-32 drop-shadow-lg"
                    />
                  )}

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Sunrise</p>
                    <p className="text-xl font-bold">
                      {data.sys?.sunrise && formatTime(data.sys.sunrise)}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Sunset</p>
                    <p className="text-xl font-bold">
                      {data.sys?.sunset && formatTime(data.sys.sunset)}
                    </p>
                  </div>

                </div>

              </div>

              {/* BOTTOM INFO */}
              <div className="grid grid-cols-2 gap-6 mt-10 pt-6 border-t border-white/10">

                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Humidity</p>
                  <p className="text-xl font-bold">
                    {data.main?.humidity}%
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">Wind</p>
                  <p className="text-xl font-bold">
                    {data.wind?.speed} MPH
                  </p>
                </div>

              </div>
            </>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
