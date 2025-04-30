"use client"

const AstronomicalData = ({ astronomicalData, sunrise, sunset, formatTime }) => {
  if (!astronomicalData) return null

  // Format time for display
  const formatTimeFromDate = (date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  // Check if a time is currently active
  const isTimeActive = (startTime, endTime) => {
    const now = new Date()
    return now >= startTime && now <= endTime
  }

  // Calculate if any special time is currently active
  const isGoldenHourMorning = isTimeActive(astronomicalData.goldenMorningStart, astronomicalData.goldenMorningEnd)
  const isGoldenHourEvening = isTimeActive(astronomicalData.goldenEveningStart, astronomicalData.goldenEveningEnd)
  const isBlueHourMorning = isTimeActive(astronomicalData.blueHourMorningStart, astronomicalData.blueHourMorningEnd)
  const isBlueHourEvening = isTimeActive(astronomicalData.blueHourEveningStart, astronomicalData.blueHourEveningEnd)

  return (
    <div className="w-full md:w-3/5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Sunrise & Sunset</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-300 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-blue-100 text-sm">Sunrise</span>
              </div>
              <p className="text-white font-medium">{formatTime(sunrise)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-400 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-blue-100 text-sm">Sunset</span>
              </div>
              <p className="text-white font-medium">{formatTime(sunset)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Golden Hour</h3>
          <div className="space-y-2">
            <div>
              <p className="text-blue-100 text-sm">Morning Golden Hour:</p>
              <p className={`text-white font-medium ${isGoldenHourMorning ? "text-yellow-300" : ""}`}>
                {formatTimeFromDate(astronomicalData.goldenMorningStart)} -{" "}
                {formatTimeFromDate(astronomicalData.goldenMorningEnd)}
                {isGoldenHourMorning && " (Now)"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Evening Golden Hour:</p>
              <p className={`text-white font-medium ${isGoldenHourEvening ? "text-yellow-300" : ""}`}>
                {formatTimeFromDate(astronomicalData.goldenEveningStart)} -{" "}
                {formatTimeFromDate(astronomicalData.goldenEveningEnd)}
                {isGoldenHourEvening && " (Now)"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Blue Hour</h3>
          <div className="space-y-2">
            <div>
              <p className="text-blue-100 text-sm">Morning Blue Hour:</p>
              <p className={`text-white font-medium ${isBlueHourMorning ? "text-blue-300" : ""}`}>
                {formatTimeFromDate(astronomicalData.blueHourMorningStart)} -{" "}
                {formatTimeFromDate(astronomicalData.blueHourMorningEnd)}
                {isBlueHourMorning && " (Now)"}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Evening Blue Hour:</p>
              <p className={`text-white font-medium ${isBlueHourEvening ? "text-blue-300" : ""}`}>
                {formatTimeFromDate(astronomicalData.blueHourEveningStart)} -{" "}
                {formatTimeFromDate(astronomicalData.blueHourEveningEnd)}
                {isBlueHourEvening && " (Now)"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-2">Photography Tips</h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-100">
              {isGoldenHourMorning || isGoldenHourEvening
                ? "🔥 Perfect time for warm, soft lighting photos!"
                : isBlueHourMorning || isBlueHourEvening
                  ? "🌌 Great time for dramatic, blue-toned photos!"
                  : "Best photos during golden hour (after sunrise/before sunset)"}
            </p>
            <p className="text-blue-100">
              {astronomicalData.moonIllumination > 0.8
                ? "Full moon provides good night lighting"
                : astronomicalData.moonIllumination < 0.2
                  ? "Low moon illumination - good for astrophotography"
                  : "Moderate moon light - balanced night photos"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AstronomicalData
