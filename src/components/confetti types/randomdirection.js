import { ConfettiButton } from "@/utils/confetti"

export function RandomConfetti({ButtonText = "Random Confetti"}) {
  return (
    <div className="relative">
      <ConfettiButton
        options={{
          get angle() {
            return Math.random() * 360
          },
        }}
      >
        {ButtonText}
      </ConfettiButton>
    </div>
  )
}