"use client";

import { Button, Paper } from "@mui/material";
import styles from "./evolvingpopup.module.css";
import { Typography } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ChooseConfetti from "../choose confetti/chooseconfetti";

export default function EvolvingPopup({setIsEvolvingPopupOpen}) {

  return (
    <Paper className={styles.EvolvingPopup} sx={{ backgroundColor: (theme) => theme.palette.primary.main, boxShadow: `0px 0.5rem 5rem rgba(114, 201, 255, 0.9)`, }}>
      <div className={styles.PopupContent}>
        <div className={styles.EvolvingImage}>
          <img src="/Melt Human.gif" alt="Previous Pet" />
          <KeyboardDoubleArrowUpIcon sx={{ fontSize: 100, color: 'rgba(255, 114, 154, 1)' }} />
          <img src="/Thirsty Human.gif" alt="Evolved Pet" />
        </div>
        <Typography variant="h6">Your pet is...</Typography>
        <Typography variant="h1">EVOLVING!</Typography>
        <ChooseConfetti text="🎉 Celebrate! 🎉"/>
        <Button variant="contained" color="secondary" sx={{mt: 2}} onClick={() => setIsEvolvingPopupOpen(false)}>Continue</Button>
      </div>
    </Paper>
  );
}