"use client"

const CityCard = ({ cityWeather, unit, onRemove, onSelect, getWeatherIconUrl }) => {
  if (!cityWeather) return null

  // Helper function to determine if it's day or night based on icon
  const isDaytime = () => {
    if (!cityWeather || !cityWeather.weather || !cityWeather.weather[0] || !cityWeather.weather[0].icon) return true
    return !cityWeather.weather[0].icon.includes("n")
  }

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg border border-white/10 transition-all hover:translate-y-[-5px] hover:shadow-xl ${
        isDaytime()
          ? "bg-gradient-to-br from-blue-500/20 to-indigo-600/30"
          : "bg-gradient-to-br from-indigo-800/30 to-purple-900/40"
      } backdrop-blur-md group`}
    >
      <div className="p-5 cursor-pointer" onClick={onSelect}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xl font-bold text-white flex items-center gap-1">
              {cityWeather.name}
              <span className="text-xs font-normal bg-white/20 px-1.5 py-0.5 rounded-md ml-1">
                {cityWeather.sys.country}
              </span>
            </h4>
            <p className="text-blue-100 text-sm mt-1 opacity-80">
              {new Date().toLocaleDateString("en-US", { weekday: "short" })},{" "}
              {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <div className="text-3xl font-bold text-white flex flex-col items-end">
            {Math.round(cityWeather.main.temp)}°
            <span className="text-xs font-normal text-blue-100 opacity-80">{unit === "metric" ? "C" : "F"}</span>
          </div>
        </div>

        <div className="flex items-center mt-3 bg-white/10 rounded-lg p-2 -mx-1">
          <img
            src={getWeatherIconUrl(cityWeather.weather[0].icon) || "/placeholder.svg"}
            alt={cityWeather.weather[0].description}
            className="w-14 h-14"
          />
          <p className="text-sm text-white capitalize font-medium">{cityWeather.weather[0].description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Humidity</p>
            <p className="text-lg font-semibold text-white">{cityWeather.main.humidity}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Wind</p>
            <p className="text-lg font-semibold text-white">
              {Math.round(cityWeather.wind.speed)} {unit === "metric" ? "m/s" : "mph"}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`p-3 flex justify-between items-center border-t border-white/10 ${
          isDaytime()
            ? "bg-gradient-to-r from-blue-600/30 to-indigo-700/30"
            : "bg-gradient-to-r from-indigo-700/30 to-purple-800/30"
        }`}
      >
        <button
          onClick={onSelect}
          className="text-white text-sm hover:text-blue-200 transition-colors flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-white/70 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-white/10"
          title="Remove from saved cities"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CityCard
