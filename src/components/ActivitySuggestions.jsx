"use client"

const ActivitySuggestions = ({ weather, unit }) => {
  if (!weather) return null

  // Helper function to get temperature category
  const getTemperatureCategory = (temp) => {
    const tempC = unit === "imperial" ? ((temp - 32) * 5) / 9 : temp

    if (tempC < 0) return "freezing"
    if (tempC < 10) return "cold"
    if (tempC < 20) return "cool"
    if (tempC < 28) return "moderate"
    if (tempC < 35) return "warm"
    return "hot"
  }

  // Helper function to get weather condition category
  const getWeatherCategory = () => {
    const condition = weather.weather[0].main.toLowerCase()
    const id = weather.weather[0].id

    if (id >= 200 && id < 300) return "thunderstorm"
    if (id >= 300 && id < 400) return "drizzle"
    if (id >= 500 && id < 600) return "rain"
    if (id >= 600 && id < 700) return "snow"
    if (id >= 700 && id < 800) return "atmosphere" // fog, mist, etc.
    if (id === 800) return "clear"
    if (id > 800) return "cloudy"

    return condition
  }

  // Helper function to get wind category
  const getWindCategory = () => {
    const windSpeed = weather.wind.speed
    const isMetric = unit === "metric"

    // Convert to m/s if imperial
    const speedInMS = isMetric ? windSpeed : windSpeed * 0.44704

    if (speedInMS < 0.5) return "calm"
    if (speedInMS < 3.3) return "light"
    if (speedInMS < 7.9) return "moderate"
    if (speedInMS < 13.8) return "strong"
    return "severe"
  }

  // Get current categories
  const tempCategory = getTemperatureCategory(weather.main.temp)
  const weatherCategory = getWeatherCategory()
  const windCategory = getWindCategory()
  const isDay = weather.weather[0].icon.includes("d")
  const humidity = weather.main.humidity

  // Generate activity suggestions based on conditions
  const getOutdoorActivities = () => {
    const activities = []

    // Temperature-based
    if (tempCategory === "freezing") {
      activities.push("Ice skating", "Snowboarding", "Building a snowman")
    } else if (tempCategory === "cold") {
      activities.push("Brisk walking", "Winter hiking", "Photography")
    } else if (tempCategory === "cool") {
      activities.push("Jogging", "Cycling", "Outdoor workout")
    } else if (tempCategory === "moderate") {
      activities.push("Picnic in the park", "Outdoor dining", "Hiking")
    } else if (tempCategory === "warm") {
      activities.push("Swimming", "Beach visit", "Water sports")
    } else if (tempCategory === "hot") {
      activities.push("Water park", "Pool day", "Early morning/late evening walks")
    }

    // Weather-based
    if (weatherCategory === "clear") {
      activities.push("Stargazing (at night)", "Sunbathing", "Outdoor sports")
    } else if (weatherCategory === "cloudy") {
      activities.push("Flying kites", "Photography", "Outdoor cafes")
    } else if (weatherCategory === "rain" || weatherCategory === "drizzle") {
      // Remove most outdoor activities for rain
      return ["Brief walk with umbrella", "Photography (with protection)"]
    } else if (weatherCategory === "thunderstorm") {
      // No outdoor activities for thunderstorms
      return []
    } else if (weatherCategory === "snow") {
      activities.push("Sledding", "Building snowmen", "Snowball fights")
    }

    // Wind-based adjustments
    if (windCategory === "strong" || windCategory === "severe") {
      // Filter out activities not suitable for wind
      return activities.filter((activity) => !["Flying kites", "Sunbathing", "Beach visit"].includes(activity))
    }

    return activities.slice(0, 5) // Limit to 5 suggestions
  }

  const getIndoorActivities = () => {
    const activities = [
      "Reading a book",
      "Watching movies",
      "Cooking a new recipe",
      "Board games",
      "Home workout",
      "Arts and crafts",
      "Virtual museum tours",
      "Online learning",
      "Video games",
      "Baking",
    ]

    // Weather-based adjustments
    if (weatherCategory === "clear" && tempCategory !== "hot" && tempCategory !== "freezing") {
      // On nice days, suggest fewer indoor activities
      return activities.slice(0, 3)
    }

    if (weatherCategory === "thunderstorm" || weatherCategory === "rain") {
      // Add cozy activities for rainy days
      return ["Movie marathon", "Reading with hot tea/coffee", "Baking comfort food", "Board games", "Crafting"]
    }

    return activities.slice(0, 5) // Limit to 5 suggestions
  }

  // Get photography suggestions based on conditions
  const getPhotographySuggestions = () => {
    if (weatherCategory === "thunderstorm") {
      return "Lightning photography (from a safe indoor location)"
    }

    if (weatherCategory === "rain" || weatherCategory === "drizzle") {
      return "Raindrops on windows, reflections in puddles"
    }

    if (weatherCategory === "snow") {
      return "Snow landscapes, macro shots of snowflakes"
    }

    if (weatherCategory === "clear" && !isDay) {
      return "Night sky photography, light trails"
    }

    if (weatherCategory === "clear" && isDay) {
      return "Golden hour portraits, landscapes with long shadows"
    }

    if (weatherCategory === "cloudy") {
      return "Soft, diffused lighting for portraits, moody landscapes"
    }

    if (weatherCategory === "atmosphere") {
      return "Foggy/misty scenes, atmospheric landscapes with depth"
    }

    return "Experiment with available light and weather conditions"
  }

  const outdoorActivities = getOutdoorActivities()
  const indoorActivities = getIndoorActivities()
  const photographyTip = getPhotographySuggestions()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-300 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">Outdoor Activities</h3>
        </div>

        {outdoorActivities.length > 0 ? (
          <ul className="space-y-2">
            {outdoorActivities.map((activity, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-300 mr-2">•</span>
                <span className="text-blue-100">{activity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-100 italic">
            Not recommended for outdoor activities due to current weather conditions.
          </p>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-300 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">Indoor Activities</h3>
        </div>

        <ul className="space-y-2">
          {indoorActivities.map((activity, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-300 mr-2">•</span>
              <span className="text-blue-100">{activity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
        <div className="flex items-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-300 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-white">Photography Tip</h3>
        </div>

        <p className="text-blue-100">{photographyTip}</p>
      </div>
    </div>
  )
}

export default ActivitySuggestions
