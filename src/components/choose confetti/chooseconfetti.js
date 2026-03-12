"use client";
import { useState } from "react";
import { DefaultConfetti } from "../confetti types/default";
import { FireworksConfetti } from "../confetti types/fireworks";
import { RandomConfetti } from "../confetti types/randomdirection";
import { SideCannonsConfetti } from "../confetti types/sidecannons";
import { StarsConfetti } from "../confetti types/stars";

export default function ChooseConfetti({text="Randomize Confetti"}) {

  const randomType = 4;

  const [confettiType, setConfettiType] = useState(randomType);

  const randomizeConfetti = () => {
    setConfettiType(randomType);
  }

  switch (confettiType) {
    case 0:
      return <DefaultConfetti ButtonText={text} onClick={randomizeConfetti} />;
    case 1:
      return <FireworksConfetti ButtonText={text} onClick={randomizeConfetti} />;
    case 2:
      return <RandomConfetti ButtonText={text} onClick={randomizeConfetti} />;
    case 3:
      return <SideCannonsConfetti ButtonText={text} onClick={randomizeConfetti} />;
    case 4:
      return <StarsConfetti ButtonText={text} onClick={randomizeConfetti} />;
    default:
      return <DefaultConfetti />;
  }
}