import { ConfettiButton } from "@/utils/confetti"

export function DefaultConfetti({ButtonText = "Confetti 🎉"}) {
  return (
    <div className="relative">
      <ConfettiButton>{ButtonText}</ConfettiButton>
    </div>
  )
}

