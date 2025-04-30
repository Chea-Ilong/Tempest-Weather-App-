"use client"

import { useEffect, useRef } from "react"

const MoonAnimation = ({ isVisible = true }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Get the context with fallbacks for different browsers
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return // Bail if context isn't available

    const resizeCanvas = () => {
      const parentWidth = canvas.parentElement.offsetWidth
      const parentHeight = canvas.parentElement.offsetHeight
      const size = Math.min(parentWidth, parentHeight)

      // Set canvas dimensions with device pixel ratio for sharper rendering
      const dpr = window.devicePixelRatio || 1
      canvas.width = size * dpr
      canvas.height = size * dpr

      // Scale the canvas back down with CSS
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`

      // Scale the context to match the device pixel ratio
      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
      ctx.scale(dpr, dpr)

      // Update center coordinates
      const centerX = size / 2
      const centerY = size / 2

      // Redraw with new dimensions
      drawMoon(centerX, centerY, size)
    }

    // Rest of the component remains the same, but pass centerX, centerY, and size to drawMoon

    const drawMoon = (centerX, centerY, size) => {
      const radius = Math.min(centerX, centerY) * 0.8

      // Enhanced moon craters with more realistic positions and sizes
      const craters = [
        { x: -0.2, y: -0.3, size: 0.15, depth: 0.8 },
        { x: 0.3, y: 0.1, size: 0.1, depth: 0.7 },
        { x: -0.1, y: 0.25, size: 0.12, depth: 0.9 },
        { x: 0.1, y: -0.1, size: 0.08, depth: 0.6 },
        { x: -0.3, y: 0.3, size: 0.07, depth: 0.75 },
        { x: 0.25, y: -0.25, size: 0.09, depth: 0.8 },
        { x: -0.35, y: 0.05, size: 0.11, depth: 0.7 },
        { x: 0.02, y: 0.35, size: 0.13, depth: 0.85 },
        { x: -0.15, y: -0.15, size: 0.06, depth: 0.9 },
      ]

      let glowIntensity = 0
      let glowDirection = 0.005
      let rotation = 0

      const draw = () => {
        // Clear with transparent background - only clear what we need
        ctx.globalCompositeOperation = "source-over"
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set composite operation to ensure proper transparency
        ctx.globalCompositeOperation = "source-over"

        // Update glow effect
        glowIntensity += glowDirection
        if (glowIntensity > 1 || glowIntensity < 0) {
          glowDirection *= -1
        }

        rotation += 0.001 // Very slow rotation for subtle movement

        // Draw multiple outer glows for ethereal effect with better transparency
        try {
          for (let i = 0; i < 3; i++) {
            const glowRadius = radius * (1.1 + i * 0.15)
            const glowOpacity = 0.2 - i * 0.07

            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, glowRadius)

            // Increased opacity for better Safari rendering
            gradient.addColorStop(0, `rgba(210, 230, 255, ${glowOpacity + glowIntensity * 0.15})`) // Increased from 0.07
            gradient.addColorStop(0.5, `rgba(180, 200, 240, ${glowOpacity * 0.7 + glowIntensity * 0.08})`) // Increased from 0.5 and 0.03
            gradient.addColorStop(1, "rgba(150, 180, 220, 0)")

            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
            ctx.fill()
          }
        } catch (e) {
          // Fallback for browsers that don't support gradients well
          ctx.fillStyle = "rgba(210, 230, 255, 0.3)" // Increased opacity
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw the moon body with enhanced gradient
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)

        try {
          const moonGradient = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius)

          // More realistic moon colors with better Safari rendering
          moonGradient.addColorStop(0, "rgba(255, 255, 255, 1)") // Brighter white (was 245)
          moonGradient.addColorStop(0.5, "rgba(240, 240, 255, 1)") // Brighter (was 230)
          moonGradient.addColorStop(0.8, "rgba(230, 230, 245, 1)") // Brighter (was 220)
          moonGradient.addColorStop(1, "rgba(220, 220, 235, 1)") // Brighter (was 200)

          ctx.fillStyle = moonGradient
        } catch (e) {
          // Fallback for browsers that don't support gradients well
          ctx.fillStyle = "rgba(240, 240, 255, 1)" // Brighter fallback
        }

        ctx.beginPath()
        ctx.arc(0, 0, radius, 0, Math.PI * 2)
        ctx.fill()

        // Add a subtle overall texture to the moon
        try {
          ctx.globalCompositeOperation = "multiply"

          // Create noise texture
          const noiseCanvas = document.createElement("canvas")
          const noiseCtx = noiseCanvas.getContext("2d")
          noiseCanvas.width = radius * 2
          noiseCanvas.height = radius * 2

          const noiseData = noiseCtx.createImageData(radius * 2, radius * 2)
          for (let i = 0; i < noiseData.data.length; i += 4) {
            const value = 200 + Math.random() * 55
            noiseData.data[i] = value
            noiseData.data[i + 1] = value
            noiseData.data[i + 2] = value
            noiseData.data[i + 3] = 30 // Low alpha for subtle effect
          }

          noiseCtx.putImageData(noiseData, 0, 0)

          // Apply noise texture
          ctx.globalAlpha = 0.15
          ctx.drawImage(noiseCanvas, -radius, -radius, radius * 2, radius * 2)
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = "source-over"
        } catch (e) {
          // Some browsers might not support this advanced texture effect
          ctx.globalCompositeOperation = "source-over"
        }

        // Draw enhanced craters with shadows and highlights
        craters.forEach((crater) => {
          const craterX = crater.x * radius * 2
          const craterY = crater.y * radius * 2
          const craterSize = crater.size * radius
          const craterDepth = crater.depth

          try {
            // Crater shadow (outer ring)
            const craterRingGradient = ctx.createRadialGradient(craterX, craterY, 0, craterX, craterY, craterSize * 1.1)

            craterRingGradient.addColorStop(0, `rgba(180, 180, 195, ${0.15 + (1 - craterDepth) * 0.25})`) // Increased opacity
            craterRingGradient.addColorStop(0.7, `rgba(190, 190, 205, ${0.08 + (1 - craterDepth) * 0.15})`) // Increased opacity
            craterRingGradient.addColorStop(1, "rgba(200, 200, 210, 0)")

            ctx.fillStyle = craterRingGradient
          } catch (e) {
            // Fallback for browsers that don't support gradients well
            ctx.fillStyle = "rgba(180, 180, 195, 0.25)" // Increased opacity
          }

          ctx.beginPath()
          ctx.arc(craterX, craterY, craterSize * 1.1, 0, Math.PI * 2)
          ctx.fill()

          try {
            // Crater inner shadow
            const craterGradient = ctx.createRadialGradient(
              craterX + craterSize * 0.2,
              craterY + craterSize * 0.2,
              0,
              craterX,
              craterY,
              craterSize,
            )

            // Increased opacity for better Safari rendering
            craterGradient.addColorStop(0, `rgba(160, 160, 175, ${craterDepth * 1.2})`) // Increased opacity
            craterGradient.addColorStop(0.7, `rgba(180, 180, 195, ${craterDepth * 0.9})`) // Increased opacity
            craterGradient.addColorStop(1, `rgba(200, 200, 210, ${craterDepth * 0.4})`) // Increased opacity

            ctx.fillStyle = craterGradient
          } catch (e) {
            // Fallback for browsers that don't support gradients well
            ctx.fillStyle = "rgba(160, 160, 175, 0.8)" // Increased opacity
          }

          ctx.beginPath()
          ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2)
          ctx.fill()

          // Crater highlight (light reflection)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 * craterDepth})` // Increased opacity
          ctx.beginPath()
          ctx.arc(craterX - craterSize * 0.3, craterY - craterSize * 0.3, craterSize * 0.2, 0, Math.PI * 2)
          ctx.fill()
        })

        // Add maria (dark patches) to the moon
        const maria = [
          { x: -0.1, y: 0, size: 0.4, opacity: 0.12 }, // Increased opacity
          { x: 0.2, y: 0.2, size: 0.3, opacity: 0.1 }, // Increased opacity
          { x: -0.2, y: -0.3, size: 0.25, opacity: 0.09 }, // Increased opacity
        ]

        maria.forEach((mare) => {
          const mareX = mare.x * radius * 2
          const mareY = mare.y * radius * 2
          const mareSize = mare.size * radius

          try {
            const mareGradient = ctx.createRadialGradient(mareX, mareY, 0, mareX, mareY, mareSize)

            mareGradient.addColorStop(0, `rgba(100, 100, 120, ${mare.opacity})`)
            mareGradient.addColorStop(0.7, `rgba(120, 120, 140, ${mare.opacity * 0.7})`)
            mareGradient.addColorStop(1, "rgba(150, 150, 170, 0)")

            ctx.fillStyle = mareGradient
          } catch (e) {
            // Fallback for browsers that don't support gradients well
            ctx.fillStyle = "rgba(100, 100, 120, 0.12)" // Increased opacity
          }

          ctx.beginPath()
          ctx.arc(mareX, mareY, mareSize, 0, Math.PI * 2)
          ctx.fill()
        })

        ctx.restore()

        // Add stars in the background - more subtle
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.001) * 0.15 // Increased base opacity
        for (let i = 0; i < 40; i++) {
          const starSize = Math.random() * 1.2 + 0.3
          const starX = (Math.random() * canvas.width) / (window.devicePixelRatio || 1)
          const starY = (Math.random() * canvas.height) / (window.devicePixelRatio || 1)

          // Only draw stars outside the moon area and further away
          const distFromCenter = Math.sqrt(Math.pow(starX - centerX, 2) + Math.pow(starY - centerY, 2))

          if (distFromCenter > radius * 1.4) {
            const starBrightness = 0.5 + Math.random() * 0.5 // Increased brightness
            const starColor = `rgba(255, 255, ${200 + Math.random() * 55}, ${starBrightness})`

            ctx.fillStyle = starColor
            ctx.beginPath()
            ctx.arc(starX, starY, starSize, 0, Math.PI * 2)
            ctx.fill()

            // Add star twinkle - more subtle
            if (Math.random() > 0.97) {
              ctx.fillStyle = "rgba(255, 255, 255, 0.7)" // Increased opacity
              ctx.beginPath()
              ctx.arc(starX, starY, starSize * 1.3, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
        ctx.globalAlpha = 1

        // Animate with browser compatibility
        if (window.requestAnimationFrame) {
          animationFrameId = window.requestAnimationFrame(draw)
        } else {
          // Fallback for older browsers
          animationFrameId = setTimeout(draw, 1000 / 60)
        }
      }

      // Start animation
      let animationFrameId
      draw()

      // Return cleanup function
      return () => {
        if (window.cancelAnimationFrame) {
          window.cancelAnimationFrame(animationFrameId)
        } else {
          clearTimeout(animationFrameId)
        }
      }
    }

    // Handle resize events with debounce for performance
    let resizeTimer
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resizeCanvas, 100)
    }

    // Initial setup
    resizeCanvas()

    // Add event listener with browser compatibility
    if (window.addEventListener) {
      window.addEventListener("resize", handleResize)
    } else if (window.attachEvent) {
      // For older IE
      window.attachEvent("onresize", handleResize)
    }

    // Cleanup
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener("resize", handleResize)
      } else if (window.detachEvent) {
        window.detachEvent("onresize", handleResize)
      }
      clearTimeout(resizeTimer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        opacity: 0.9,
        background: "transparent",
        border: "none",
        outline: "none",
        boxShadow: "none",
        maxWidth: "100%",
        maxHeight: "100%",
        position: "absolute",
        top: 0,
        right: 0,
      }}
    />
  )
}

export default MoonAnimation
