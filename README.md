# Weather Forecast App

A modern weather application built with React and Vite that provides current weather information and forecasts.

## Environment Setup

This application requires an OpenWeatherMap API key to function properly. Follow these steps to set up your environment:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Create a `.env` file in the root directory of the project
3. Add your API key to the `.env` file:

\`\`\`
VITE_OPENWEATHER_API_KEY=your_api_key_here
\`\`\`

## Features

- Current weather conditions
- 5-day forecast
- Search for cities worldwide
- Save favorite cities
- Recent search history
- Geolocation support
- Temperature unit conversion (Celsius/Fahrenheit)
- Day/night mode based on local sunrise/sunset times

## Development

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables as described above
4. Start the development server: `npm run dev`

## Building for Production

To build the application for production:

\`\`\`
npm run build
\`\`\`

The built files will be in the `dist` directory.

## Security Notes

- The API key is stored in an environment variable to prevent it from being exposed in the source code
- The `.env` file should NEVER be committed to version control
- Add `.env` to your `.gitignore` file to prevent accidental commits
