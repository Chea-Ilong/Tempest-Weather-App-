/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"]
export const content = ["./index.html", "./src/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"]
export const theme = {
  screens: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      sky: {
        500: "rgb(14, 165, 233)", // More saturated value
      },
      indigo: {
        800: "rgb(55, 48, 163)", // More saturated value
        900: "rgb(49, 46, 129)", // More saturated value
      },
      purple: {
        700: "rgb(126, 34, 206)", // More saturated value
        900: "rgb(88, 28, 135)", // More saturated value
      },
      blue: {
        400: "rgb(96, 165, 250)", // More saturated value
      },
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    animation: {
      spin: "spin 1s linear infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    keyframes: {
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
      pulse: {
        "0%, 100%": { opacity: 1 },
        "50%": { opacity: 0.5 },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
}
// eslint-disable-next-line no-undef
export const plugins = [require("tailwindcss-animate")]

export const safelist = [
  "from-sky-500",
  "to-indigo-900",
  "via-blue-400",
  "from-indigo-800",
  "to-purple-900",
  "via-purple-700",
  "bg-white/10",
  "bg-white/15",
  "bg-white/20",
  "bg-white/30",
  "bg-white/40",
  "bg-opacity-20",
  "bg-opacity-30",
  "bg-opacity-40",
  "bg-opacity-80",
]
