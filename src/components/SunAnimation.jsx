"use client"

import { useEffect, useRef } from "react"

const SunAnimation = ({ isVisible = true }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isVisible) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const outerRadius = Math.min(centerX, centerY) * 0.9
    const innerRadius = outerRadius * 0.7

    let rotation = 0
    let hue = 50 // Yellow-ish

    const drawSun = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the outer glow
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

      requestAnimationFrame(drawSun)
    }

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
      const centerX = size / 2
      const centerY = size / 2
      const outerRadius = Math.min(centerX, centerY) * 0.9
      const innerRadius = outerRadius * 0.7
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const animation = requestAnimationFrame(drawSun)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animation)
    }
  }, [isVisible])

  if (!isVisible) return null

  return <canvas ref={canvasRef} className="w-full h-full" style={{ opacity: 0.9 }} />
}

export default SunAnimation
