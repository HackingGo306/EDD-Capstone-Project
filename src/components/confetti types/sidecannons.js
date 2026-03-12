import { Confetti } from "@/utils/confetti"
import confetti from "canvas-confetti"
import { Button } from "@mui/material"
import { alpha } from "@mui/material"


export function SideCannonsConfetti({ButtonText = "Trigger Side Cannons"}) {
  const handleClick = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

    const frame = () => {
      if (Date.now() > end) return

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })

      requestAnimationFrame(frame)
    }

    frame()
  }

  return (
    <div className="relative">
      <Button onClick={handleClick} sx={{ mt: "0.5rem", backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.8)}} color="secondary" variant="contained">{ButtonText}</Button>
    </div>
  )
}