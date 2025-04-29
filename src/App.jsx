"use client"

import { useState, useEffect } from "react"
import "./App.css"
import SunAnimation from "./components/SunAnimation"
import MoonAnimation from "./components/MoonAnimation"
import CityCard from "./components/CityCard"

// Define API key from environment variable
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  const [query, setQuery] = useState("")
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState("metric") // metric for Celsius, imperial for Fahrenheit
  const [savedCities, setSavedCities] = useState([])
  const [citiesWeather, setCitiesWeather] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Default cities to show
  const defaultCities = ["New York", "Tokyo", "London", "Sydney", "Paris"]

  useEffect(() => {
    // Load saved cities from localStorage on initial load
    const saved = localStorage.getItem("savedCities")
    if (saved) {
      setSavedCities(JSON.parse(saved))
    } else {
      // Use default cities if none saved
      setSavedCities(defaultCities)
    }
  }, [])

  useEffect(() => {
    // Fetch weather for saved cities
    if (savedCities.length > 0) {
      fetchMultipleCitiesWeather()
    }
  }, [savedCities, unit])

  // Using a different API approach with OpenWeatherMap
  const fetchWeather = async (city) => {
    if (!city) return

    // Check if API key is available
    if (!API_KEY) {
      setError("API key is missing. Please contact the administrator.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Using API key from environment variable
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
      )

      if (!weatherResponse.ok) {
        throw new Error("City not found. Please try another location.")
      }

      const weatherData = await weatherResponse.json()
      setWeather(weatherData)

      // Fetch 5-day forecast with API key
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
      )

      if (!forecastResponse.ok) {
        throw new Error("Forecast data unavailable")
      }

      const forecastData = await forecastResponse.json()

      // Process forecast data to get one forecast per day
      const dailyData = processForecastData(forecastData.list)
      setForecast(dailyData)
    } catch (err) {
      console.error("Error fetching weather:", err)
      setError(err.message || "Failed to fetch weather data")
      setWeather(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch weather for multiple cities
  const fetchMultipleCitiesWeather = async () => {
    if (!API_KEY) {
      console.warn("API key is missing. Cannot fetch weather for saved cities.")
      return
    }

    const weatherPromises = savedCities.map((city) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
      )
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch ${city}`)
          return res.json()
        })
        .catch((err) => {
          console.error(`Error fetching ${city}:`, err)
          return null
        })
    )

    try {
      const results = await Promise.all(weatherPromises)
      setCitiesWeather(results.filter((result) => result !== null))
    } catch (err) {
      console.error("Error fetching multiple cities:", err)
    }
  }

  // Process forecast data to get one forecast per day
  const processForecastData = (forecastList) => {
    const dailyData = []
    const dateProcessed = {}

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString()

      // Only take the first forecast for each day (around noon if possible)
      if (!dateProcessed[date]) {
        dailyData.push(item)
        dateProcessed[date] = true
      }
    })

    // Limit to 5 days
    return dailyData.slice(0, 5)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      fetchWeather(query)
    }
  }

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"))
  }

  // Refetch when unit changes
  useEffect(() => {
    if (weather) {
      fetchWeather(weather.name)
    }
  }, [unit])

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  // Get time from timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  // Add city to saved cities
  const addCityToSaved = () => {
    if (weather && !savedCities.includes(weather.name)) {
      const updatedCities = [...savedCities, weather.name]
      setSavedCities(updatedCities)
      localStorage.setItem("savedCities", JSON.stringify(updatedCities))
    }
  }

  // Remove city from saved cities
  const removeSavedCity = (cityName) => {
    const updatedCities = savedCities.filter((city) => city !== cityName)
    setSavedCities(updatedCities)
    localStorage.setItem("savedCities", JSON.stringify(updatedCities))
  }

  // Switch to a saved city
  const switchToCity = (cityName) => {
    setQuery(cityName)
    fetchWeather(cityName)
  }

  // Determine if it's day or night based on current time and sunrise/sunset
  const isDaytime = () => {
    if (!weather) return true

    const currentTime = new Date().getTime() / 1000
    return currentTime > weather.sys.sunrise && currentTime < weather.sys.sunset
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isDaytime() ? "from-sky-400 to-indigo-900" : "from-indigo-900 to-purple-900"
      } p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 transition-colors duration-500`}
    >
      <div className="responsive-container relative">
        {/* Sun/Moon Animation */}
        <div
          className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 -mt-12 -mr-12 md:-mt-20 md:-mr-20 z-0 pointer-events-none overflow-visible"
          style={{ background: "transparent", border: "none", boxShadow: "none" }}
        >
          {isDaytime() ? <SunAnimation isVisible={true} /> : <MoonAnimation isVisible={true} />}
        </div>

        {/* Weather Forecast Title Component */}
        <div className="flex flex-col items-center justify-center mb-6 relative z-10 max-w-full mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">Weather Forecast</h1>
          <p className="text-blue-100 text-center">Check current weather and forecasts for any location</p>
        </div>

        {/* Redesigned Search Form - Matched to Weather Forecast dimensions */}
        <div className="mb-8 relative z-10 max-w-full mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div
              className={`flex items-center bg-white/15 backdrop-blur-lg rounded-full shadow-lg transition-all duration-300 border ${
                isSearchFocused ? "border-white/40 ring-4 ring-white/10" : "border-white/20"
              } ${loading ? "opacity-70" : ""}`}
            >
              {/* Search Icon */}
              <div className="pl-5 pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isSearchFocused ? "text-white" : "text-white/70"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search for a city or location..."
                className="flex-1 py-4 px-2 bg-transparent text-white placeholder-blue-200/70 focus:outline-none focus:placeholder-blue-100 text-base md:text-lg"
                aria-label="Search for a city"
                disabled={loading}
              />

              {/* Search Button */}
              <button
                type="submit"
                className={`m-1 py-3 px-6 md:px-8 rounded-full font-medium transition-all duration-300 ${
                  loading ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                } text-white shadow-md`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching
                  </div>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {/* Unit toggle - Aligned with search bar */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={toggleUnit}
              className="text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-2 border border-white/10 shadow-md"
            >
              <span>{unit === "metric" ? "°C" : "°F"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span>{unit === "metric" ? "°F" : "°C"}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/70 text-white p-4 rounded-lg mb-6 shadow-md backdrop-blur-md border border-red-400/30">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="bg-white/20 backdrop-blur-md rounded-xl overflow-hidden shadow-lg mb-6 border border-white/20 relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={addCityToSaved}
                disabled={savedCities.includes(weather.name)}
                className={`p-2 rounded-full ${
                  savedCities.includes(weather.name)
                    ? "bg-blue-500/50 text-white cursor-not-allowed"
                    : "bg-blue-500/70 hover:bg-blue-600/70 text-white"
                } transition-colors`}
                title={savedCities.includes(weather.name) ? "City already saved" : "Save city"}
              >
                {savedCities.includes(weather.name) ? "★" : "☆"}
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center mt-4">
                    <img
                      src={getWeatherIconUrl(weather.weather[0].icon) || "/placeholder.svg"}
                      alt={weather.weather[0].description}
                      className="w-20 h-20"
                    />
                    <div>
                      <p className="text-xl text-white capitalize">{weather.weather[0].description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 text-center md:text-right">
                  <div className="text-6xl font-bold text-white">
                    {Math.round(weather.main.temp)}°{unit === "metric" ? "C" : "F"}
                  </div>
                  <div className="text-blue-100 mt-2">
                    <p>
                      Feels like: {Math.round(weather.main.feels_like)}°{unit === "metric" ? "C" : "F"}
                    </p>
                    <p className="mt-1">
                      Min: {Math.round(weather.main.temp_min)}° / Max: {Math.round(weather.main.temp_max)}°
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Humidity</p>
                  <p className="text-xl font-semibold text-white">{weather.main.humidity}%</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Wind</p>
                  <p className="text-xl font-semibold text-white">
                    {Math.round(weather.wind.speed)} {unit === "metric" ? "m/s" : "mph"}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Pressure</p>
                  <p className="text-xl font-semibold text-white">{weather.main.pressure} hPa</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Visibility</p>
                  <p className="text-xl font-semibold text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Sunrise</p>
                  <p className="text-xl font-semibold text-white">{formatTime(weather.sys.sunrise)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-100 text-sm">Sunset</p>
                  <p className="text-xl font-semibold text-white">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && !loading && (
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-lg border border-white/20 mb-6 xs:mb-8">
            <h3 className="text-xl xs:text-2xl font-bold text-white mb-4 xs:mb-6">5-Day Forecast</h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-3 xs:gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-blue-500/30 to-indigo-600/30 rounded-lg p-3 xs:p-4 text-center backdrop-blur-sm shadow-md border border-white/10"
                >
                  <p className="font-semibold text-white">{formatDate(day.dt)}</p>
                  <img
                    src={getWeatherIconUrl(day.weather[0].icon) || "/placeholder.svg"}
                    alt={day.weather[0].description}
                    className="w-16 h-16 mx-auto"
                  />
                  <p className="text-2xl font-bold text-white">
                    {Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}
                  </p>
                  <p className="text-sm text-blue-100 capitalize">{day.weather[0].description}</p>
                  <div className="mt-2 pt-2 border-t border-white/20 grid grid-cols-2 gap-1 text-xs text-blue-100">
                    <div>
                      <p>Humidity</p>
                      <p className="font-medium text-white">{day.main.humidity}%</p>
                    </div>
                    <div>
                      <p>Wind</p>
                      <p className="font-medium text-white">
                        {Math.round(day.wind.speed)} {unit === "metric" ? "m/s" : "mph"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Cities Section */}
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-lg border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Other Cities</h3>

          {citiesWeather.length === 0 ? (
            <p className="text-blue-100">No saved cities yet. Search for a city and save it to see it here.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {citiesWeather.map((cityWeather, index) => (
                <CityCard
                  key={index}
                  cityWeather={cityWeather}
                  unit={unit}
                  onRemove={() => removeSavedCity(cityWeather.name)}
                  onSelect={() => switchToCity(cityWeather.name)}
                  getWeatherIconUrl={getWeatherIconUrl}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty state - show when no search has been performed */}
        {!weather && !loading && !error && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center shadow-lg border border-white/20">
            <div className="text-6xl mb-4">🌤️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Search for a city to get started</h3>
            <p className="text-blue-100">Enter a city name to see current weather and forecast</p>
          </div>

          
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>Weather data provided by OpenWeatherMap</p>
        </div>
      </div>
    </div>
  )
}

export default App