"use client";
import {useState, useEffect} from "react";
import { Button } from "@mui/material";
import Confetti from "../confetti types/default";
import { FireworksConfetti } from "../confetti types/fireworks";
import { RandomConfetti } from "../confetti types/randomdirection";
import { SideCannonsConfetti } from "../confetti types/sidecannons";
import { StarsConfetti } from "../confetti types/stars";

export default function ChooseConfetti() {

  const [confettiType, setConfettiType] = useState(0);


    return (
        <Button onClick></Button>
    );
}