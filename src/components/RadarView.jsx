"use client"

import { useEffect, useRef, useState } from "react"

const RadarView = ({ lat, lon, apiKey }) => {
  const mapRef = useRef(null)
  const [mapType, setMapType] = useState("precipitation")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!lat || !lon || !apiKey) {
      setError("Missing location data or API key")
      setLoading(false)
      return
    }

    // Load the map
    const loadMap = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Leaflet is already loaded
        if (!window.L) {
          // Load Leaflet CSS
          const linkEl = document.createElement("link")
          linkEl.rel = "stylesheet"
          linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(linkEl)

          // Load Leaflet JS
          const scriptEl = document.createElement("script")
          scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          scriptEl.async = true

          // Wait for script to load
          await new Promise((resolve, reject) => {
            scriptEl.onload = resolve
            scriptEl.onerror = reject
            document.head.appendChild(scriptEl)
          })
        }

        // Initialize map if container exists and Leaflet is loaded
        if (mapRef.current && window.L) {
          // Clear previous map instance if it exists
          if (mapRef.current._leaflet_id) {
            mapRef.current._leaflet_id = null
            mapRef.current.innerHTML = ""
          }

          // Create map
          const map = window.L.map(mapRef.current).setView([lat, lon], 8)

          // Add OpenStreetMap base layer
          window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          }).addTo(map)

          // Add weather layer based on selected type
          const weatherLayer = window.L.tileLayer(
            `https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${apiKey}`,
            {
              attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
              maxZoom: 18,
            },
          ).addTo(map)

          // Add marker for current location
          window.L.marker([lat, lon]).addTo(map).bindPopup("Your location").openPopup()

          // Store map instance for later cleanup
          mapRef.current._map = map
          mapRef.current._weatherLayer = weatherLayer
        }
      } catch (err) {
        console.error("Error loading map:", err)
        setError("Failed to load map. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadMap()

    // Cleanup function
    return () => {
      if (mapRef.current && mapRef.current._map) {
        mapRef.current._map.remove()
        mapRef.current._map = null
      }
    }
  }, [lat, lon, apiKey, mapType])

  // Update weather layer when map type changes
  useEffect(() => {
    if (mapRef.current && mapRef.current._map && mapRef.current._weatherLayer) {
      // Remove old layer
      mapRef.current._map.removeLayer(mapRef.current._weatherLayer)

      // Add new layer
      const newWeatherLayer = window.L.tileLayer(
        `https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${apiKey}`,
        {
          attribution: '&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>',
          maxZoom: 18,
        },
      ).addTo(mapRef.current._map)

      // Update reference
      mapRef.current._weatherLayer = newWeatherLayer
    }
  }, [mapType, apiKey])

  const handleMapTypeChange = (type) => {
    setMapType(type)
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleMapTypeChange("precipitation")}
          className={`px-3 py-1.5 rounded-full text-sm ${mapType === "precipitation" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
        >
          Precipitation
        </button>
        <button
          onClick={() => handleMapTypeChange("clouds")}
          className={`px-3 py-1.5 rounded-full text-sm ${mapType === "clouds" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
        >
          Clouds
        </button>
        <button
          onClick={() => handleMapTypeChange("pressure")}
          className={`px-3 py-1.5 rounded-full text-sm ${mapType === "pressure" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
        >
          Pressure
        </button>
        <button
          onClick={() => handleMapTypeChange("wind")}
          className={`px-3 py-1.5 rounded-full text-sm ${mapType === "wind" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
        >
          Wind
        </button>
        <button
          onClick={() => handleMapTypeChange("temp")}
          className={`px-3 py-1.5 rounded-full text-sm ${mapType === "temp" ? "bg-blue-500 text-white" : "bg-white/10 text-blue-100 hover:bg-white/20"}`}
        >
          Temperature
        </button>
      </div>

      {error && (
        <div className="bg-red-500/50 text-white p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white/10 rounded-lg h-[600px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-white mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-blue-100">Loading map...</p>
          </div>
        </div>
      ) : (
        <div
          ref={mapRef}
          className="w-full h-[600px] rounded-lg overflow-hidden border border-white/20"
          style={{ background: "#f0f0f0" }}
        ></div>
      )}

      <div className="mt-4 text-sm text-blue-100">
        <p>
          {mapType === "precipitation" && "Precipitation radar shows rain, snow, and other precipitation patterns."}
          {mapType === "clouds" && "Cloud coverage map shows the distribution and density of clouds."}
          {mapType === "pressure" && "Pressure map shows atmospheric pressure patterns."}
          {mapType === "wind" && "Wind map shows wind speed and direction patterns."}
          {mapType === "temp" && "Temperature map shows temperature distribution."}
        </p>
      </div>
    </div>
  )
}

export default RadarView
