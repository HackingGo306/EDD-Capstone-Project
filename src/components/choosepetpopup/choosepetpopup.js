"use client";

import { useState, useCallback, useContext } from "react";
import styles from "./choosepetpopup.module.css";
import { Typography } from "@mui/material";
import { Paper, alpha } from "@mui/material";
import { Button } from "@mui/material";
import { choosePet } from "@/api/PetAPI";
import { PetsContext } from "@/utils/contexts";

export default function ChoosePetPopup({ setIsChoosePetPopupOpen }) {

  const [pet, setPet] = useState(0);
  const { refreshPets } = useContext(PetsContext);
  const petOptions = ["Cat", "Dog", "Fly", "Human"];

  const handlePetConfirm = useCallback(() => {
    if (!pet) {
      return;
    }
    const lowercasePet = pet.toLowerCase(); 
    choosePet({ pet: lowercasePet });
    setIsChoosePetPopupOpen(false);
    refreshPets();
  }, [pet]);

  return (
    <Paper className={styles.ChoosePetPopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.9) }}>
      <div className={styles.PopupContent}>

        { // display image of a cracked egg with glowing golden light
          <div />
        }

        {

          <div>
            <Typography variant="h1">Your egg is hatching... Choose your pet!</Typography>
          </div>
        }

        <div className={styles.ProgressContainer}>

          { //one button per pet, with the pet's name and image on the button. When a button is clicked, the corresponding pet is selected and the button is disabled. The selected pet's button should have a glowing border to indicate selection

            <div>
              {petOptions.map((petOption, i) => (
                <Button key={i} sx={{ mr: 1, backgroundColor: (theme) => alpha(theme.palette.secondary.main, (pet == petOption ? 0.8 : 0.3)) }} variant="contained" color="secondary" onClick={() => setPet(petOption)}>
                  {petOption}
                </Button>
              ))
              }
            </div>
          }

          {
            (() => {
              if (pet === "Cat") {
                return <div>
                  <Typography variant="h1">Cat</Typography>
                </div>
              } else if (pet === "Dog") {
                return <div>
                  <Typography variant="h1">Dog</Typography>
                </div>
              } else if (pet === "Fly") {
                return <div>
                  <Typography variant="h1">Fly</Typography>
                </div>
              } else if (pet === "Human") {
                return <div>
                  <Typography variant="h1">Human</Typography>
                </div>
              }
            })()
          }

          {
            <Button sx={{ mt: "1.0rem" }} variant="outlined" color="secondary" onClick={handlePetConfirm}>Done</Button>
          }

        </div>
      </div>
    </Paper>
  );
}