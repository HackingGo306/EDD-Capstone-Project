import { ConfettiButton } from "@/utils/confetti"
import confetti from "canvas-confetti"
import { Button } from "@mui/material"

export function DefaultConfetti({ButtonText = "Confetti 🎉"}) {
  return (
    <div className="relative">
      <ConfettiButton>{ButtonText}</ConfettiButton>
    </div>
  )
}

