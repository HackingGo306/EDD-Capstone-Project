"use client";

import { Button, Paper } from "@mui/material";
import styles from "./evolvingpopup.module.css";
import { Typography } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChooseConfetti from "../choose confetti/chooseconfetti";
import { useCallback, useContext, useEffect, useState } from "react";
import { PetsContext, UserInfoContext } from "@/utils/contexts";
import { petImg } from "@/utils/tools";
import { newPet } from "@/api/PetAPI";

export default function EvolvingPopup({ setIsEvolvingPopupOpen, setIsChoosePetPopupOpen, openChoosePet }) {

  const { userInfo, refreshUserInfo } = useContext(UserInfoContext);
  const { pets, refreshPets } = useContext(PetsContext);
  const [currentPet, setCurrentPet] = useState({ type: '', level: 0 });

  useEffect(() => {

    if (!userInfo?.loggedIn) return;
    if (!pets?.length) return;

    const userPet = pets.find((pet) => pet.pet_id == userInfo.data.pet);
    if (!userPet) return;
    setCurrentPet(userPet);
  }, [pets, userInfo])

  const handleContinue = useCallback(() => {
    setIsEvolvingPopupOpen(false);

    const userPet = pets.find((pet) => pet.pet_id == userInfo.data.pet);
    if (!userPet) return;
    setCurrentPet(userPet);

    if (userPet.level == 1) {
      setIsChoosePetPopupOpen(true);
    }
    else if (userPet.level == 5) {
      newPet();
      refreshPets();
      refreshUserInfo();
    }


  }, [userInfo, pets]);

  return (
    <Paper className={styles.EvolvingPopup} sx={{ backgroundColor: (theme) => theme.palette.primary.main, boxShadow: `0px 0.5rem 5rem rgba(114, 201, 255, 0.9)`, }}>
      <div className={styles.PopupContent}>
        {
          currentPet.level == 5 ? <div><Typography variant="h6">Your pet has maxed out! You get a new egg</Typography>
            <div className={styles.EvolvingImage}>
              <img className={styles.PetImage} src={petImg("egg", 0, 0)} alt="New Pet" />
            </div>
          </div>
            :
            <div>
              <div className={styles.EvolvingImage}>
                <img className={styles.PetImage} src={petImg(currentPet.type, currentPet.level - 1, currentPet.xp)} alt="Previous Pet" />
                <KeyboardDoubleArrowUpIcon sx={{ fontSize: 100, color: 'rgba(255, 114, 154, 1)' }} />
                <img className={styles.PetImage} src={petImg(currentPet.type, currentPet.level, currentPet.xp)} alt="Evolved Pet" />
              </div>
              <Typography variant="h6">Your pet is...</Typography>
              <Typography variant="h1">EVOLVING!</Typography>
            </div>
        }
        <ChooseConfetti text="🎉 Celebrate! 🎉" />
        <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleContinue}>Continue</Button>
      </div>
    </Paper>
  );
}