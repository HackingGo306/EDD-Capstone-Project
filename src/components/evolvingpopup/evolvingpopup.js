"use client";

import { Paper, alpha } from "@mui/material";
import styles from "./evolvingpopup.module.css";
import { Typography } from "@mui/material";

export default function EvolvingPopup() {

  return (
    <Paper className={styles.EvolvingPopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5) }}>
      <div className={styles.PopupContent}>
        <img src="/heart.png" alt="Pet" width={500} height={500} />
        <Typography variant="h1">Your Pet is EVOLVING...</Typography>
        <Typography variant="h6">Keep it up!</Typography>
      </div>
    </Paper>
  );
}