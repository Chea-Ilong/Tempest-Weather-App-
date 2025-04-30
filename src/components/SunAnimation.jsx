"use client"

import { useEffect, useRef } from "react"

const SunAnimation = ({ isVisible = true }) => {
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

      // Update center coordinates based on new dimensions
      const newCenterX = size / 2
      const newCenterY = size / 2
      const newOuterRadius = Math.min(newCenterX, newCenterY) * 0.9
      const newInnerRadius = newOuterRadius * 0.7

      // Scale the context to match the device pixel ratio
      ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset transform
      ctx.scale(dpr, dpr)

      // Redraw with new dimensions
      drawSun(newCenterX, newCenterY, newOuterRadius, newInnerRadius)
    }

    const drawSun = (centerX, centerY, outerRadius, innerRadius) => {
      // Clear with a transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Initialize variables for animation
      let rotation = 0
      let hue = 50 // Yellow-ish

      const animate = () => {
        // Clear with transparent background
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw the outer glow
        try {
          const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            innerRadius * 0.8,
            centerX,
            centerY,
            outerRadius * 1.2,
          )
          gradient.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.15)`)
          gradient.addColorStop(0.5, `hsla(${hue}, 100%, 70%, 0.05)`)
          gradient.addColorStop(1, `hsla(${hue}, 100%, 75%, 0)`)

          ctx.fillStyle = gradient
        } catch (e) {
          // Fallback for browsers that don't support gradients well
          ctx.fillStyle = "rgba(255, 255, 200, 0.15)"
        }

        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius * 1.2, 0, Math.PI * 2)
        ctx.fill()

        // Draw the sun body
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`
        ctx.beginPath()
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw rays
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)

        const rayCount = 12
        const rayLength = outerRadius - innerRadius
        const rayWidth = Math.PI / 24

        ctx.fillStyle = `hsl(${hue}, 100%, 75%)`

        for (let i = 0; i < rayCount; i++) {
          const angle = (i * 2 * Math.PI) / rayCount

          ctx.save()
          ctx.rotate(angle)
          ctx.beginPath()
          ctx.moveTo(innerRadius, -rayWidth * innerRadius)
          ctx.lineTo(innerRadius + rayLength, 0)
          ctx.lineTo(innerRadius, rayWidth * innerRadius)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        }

        ctx.restore()

        // Animate
        rotation += 0.002
        hue = 50 + Math.sin(rotation * 5) * 5 // Slight hue variation

        // Request next frame with browser compatibility
        if (window.requestAnimationFrame) {
          animationFrameId = window.requestAnimationFrame(animate)
        } else {
          // Fallback for older browsers
          animationFrameId = setTimeout(animate, 1000 / 60)
        }
      }

      // Start animation
      let animationFrameId
      animate()

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
      className="w-full h-full"
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

export default SunAnimation
