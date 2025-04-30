"use client"

import { useEffect, useRef } from "react"

const MoonPhaseDisplay = ({ moonPhase, illumination, moonName }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1
    const parentWidth = canvas.parentElement ? canvas.parentElement.offsetWidth : 200
    const size = Math.min(200, parentWidth - 20) // Max size of 200px or parent width - padding

    canvas.width = size * dpr
    canvas.height = size * dpr

    // Scale the canvas back down with CSS
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    // Scale the context to match the device pixel ratio
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Center coordinates
    const centerX = size / 2
    const centerY = size / 2
    const radius = size * 0.4

    // Draw moon background (full circle)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = "#E1E1E1" // Light gray for moon
    ctx.fill()

    // Ensure we have valid illumination value
    const illum = typeof illumination === "number" && !isNaN(illumination) ? illumination : 0.5

    // Determine if waxing (increasing) or waning (decreasing)
    // For simplicity, we'll use the moon phase name to determine this
    const isWaxing =
      moonName && (moonName.includes("Waxing") || moonName.includes("New") || moonName === "First Quarter")

    ctx.beginPath()

    // Draw the shadow part of the moon
    if (isWaxing) {
      // Waxing: shadow on left side
      ctx.arc(centerX, centerY, radius, Math.PI * 0.5, Math.PI * 1.5)

      // Calculate the x-position of the ellipse based on illumination
      const ellipseX = centerX + radius * (1 - 2 * illum)

      // Draw the elliptical arc to create the terminator (shadow edge)
      ctx.ellipse(ellipseX, centerY, radius * Math.abs(1 - 2 * illum), radius, 0, Math.PI * 1.5, Math.PI * 0.5)
    } else {
      // Waning: shadow on right side
      ctx.arc(centerX, centerY, radius, Math.PI * 1.5, Math.PI * 0.5)

      // Calculate the x-position of the ellipse based on illumination
      const ellipseX = centerX - radius * (1 - 2 * (1 - illum))

      // Draw the elliptical arc to create the terminator (shadow edge)
      ctx.ellipse(ellipseX, centerY, radius * Math.abs(1 - 2 * (1 - illum)), radius, 0, Math.PI * 0.5, Math.PI * 1.5)
    }

    ctx.fillStyle = "#333" // Dark gray for shadow
    ctx.fill()

    // Draw some craters for realism
    const craters = [
      { x: -0.2, y: -0.3, size: 0.15 },
      { x: 0.3, y: 0.1, size: 0.1 },
      { x: -0.1, y: 0.25, size: 0.12 },
      { x: 0.1, y: -0.1, size: 0.08 },
    ]

    craters.forEach((crater) => {
      const craterX = centerX + crater.x * radius * 2
      const craterY = centerY + crater.y * radius * 2
      const craterSize = crater.size * radius

      // Only draw craters on the visible part of the moon
      const distFromCenter = Math.sqrt(Math.pow(craterX - centerX, 2) + Math.pow(craterY - centerY, 2))

      if (distFromCenter <= radius) {
        // Check if the crater is in the visible part based on phase
        let isVisible = true

        if (isWaxing && craterX < centerX - radius * (1 - 2 * illum)) {
          isVisible = false
        } else if (!isWaxing && craterX > centerX + radius * (1 - 2 * (1 - illum))) {
          isVisible = false
        }

        if (isVisible) {
          // Draw crater
          ctx.beginPath()
          ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(180, 180, 180, 0.8)"
          ctx.fill()

          // Draw crater shadow
          ctx.beginPath()
          ctx.arc(craterX + craterSize * 0.2, craterY + craterSize * 0.2, craterSize * 0.8, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(160, 160, 160, 0.6)"
          ctx.fill()
        }
      }
    })

    // Draw moon border
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
    ctx.lineWidth = 1
    ctx.stroke()
  }, [moonPhase, illumination, moonName])

  // Format illumination as percentage
  const illuminationPercent = Math.round(illumination * 100)

  return (
    <div className="w-full md:w-2/5 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-2">Moon Phase</h3>
      <div className="flex flex-col items-center">
        <div className="relative mb-3">
          <canvas ref={canvasRef} className="w-full max-w-[200px] h-auto" style={{ background: "transparent" }} />
          <div className="absolute bottom-0 right-0 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
            {illuminationPercent}% visible
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-medium text-lg">{moonName}</p>
          <p className="text-blue-100 text-sm">
            {illuminationPercent < 10
              ? "Perfect for stargazing"
              : illuminationPercent > 90
                ? "Bright nights, good visibility"
                : "Moderate moon illumination"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MoonPhaseDisplay
