"use client";

import { useState, useCallback, useContext } from "react";
import styles from "./choosepetpopup.module.css";
import { TextField, Typography } from "@mui/material";
import { Paper, alpha } from "@mui/material";
import { Button } from "@mui/material";
import { choosePet } from "@/api/PetAPI";
import { PetsContext } from "@/utils/contexts";

export default function ChoosePetPopup({ setIsChoosePetPopupOpen }) {

  const [pet, setPet] = useState(0);
  const [petName, setPetName] = useState("");
  const { refreshPets } = useContext(PetsContext);
  const petOptions = ["Cat", "Dog", "Fly", "Emoji"];

  const handlePetConfirm = useCallback(() => {
    if (!pet) {
      return;
    }
    const lowercasePet = pet.toLowerCase();
    choosePet({ pet: lowercasePet, petName: petName });
    setIsChoosePetPopupOpen(false);
    refreshPets();
  }, [pet, petName]);

  return (
    <Paper className={styles.ChoosePetPopup} sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
      <div className={styles.PopupContent}>

        { // display image of a cracked egg with glowing golden light
          <div />
        }

        {

          <div>
            <Typography variant="h1" gutterBottom>Your egg is hatching...</Typography>
            <Typography variant="h5">Choose your pet!</Typography>
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
                return <img className={styles.PetImage} src="/Cat Pet/Cat 1.png" alt="Cat" />
              } else if (pet === "Dog") {
                return <div>
                  <Typography variant="h1">Dog</Typography>
                </div>
              } else if (pet === "Fly") {
                return <div>
                  <Typography variant="h1">Fly</Typography>
                </div>
              } else if (pet === "Emoji") {
                return <div>
                  <Typography variant="h1">Emoji</Typography>
                </div>
              }
            })()
          }
          {
            (pet != 0) &&
            <div>
              <TextField variant="standard" color="secondary" label="Give it a name!" size="small" onChange={(e) => setPetName(e.target.value)}
                InputProps={{
                  inputProps: {
                    maxLength: 20 // Set the maximum length to 10 characters
                  }
                }} />
            </div>
          }

          {
            <Button sx={{ mt: "1.0rem" }} variant="contained" color="secondary" onClick={handlePetConfirm}>Confirm</Button>
          }

        </div>
      </div>
    </Paper>
  );
}