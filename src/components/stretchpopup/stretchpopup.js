"use client";

import { Paper, alpha } from "@mui/material";
import styles from "./stretchpopup.module.css";

export default function StretchPopup() {

  return (
    <Paper className={styles.StretchPopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5) }}>
      <div className={styles.PopupContent}>
        <img src="/heart.png" alt="Pet" width={500} height={500} />
        <h1>STRETCH BREAK!</h1>
        <h2>Time to stand up...</h2>
        <h3>Do a little dance for your pet because your pet is bored.</h3>
      </div>
    </Paper>
  );
}