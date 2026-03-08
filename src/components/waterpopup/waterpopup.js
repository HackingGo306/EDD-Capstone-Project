"use client";

import { Paper, Typography, alpha } from "@mui/material";
import styles from "./waterpopup.module.css";

export default function WaterPopup() {

  return (
    <Paper className={styles.WaterPopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5) }}>
      <div className={styles.PopupContent}>
        <img src="/heart.png" alt="Pet" width={500} height={500} />
        <h1>WATER BREAK!</h1>
        <h2>Hydration time! Take a moment to drink some water and refresh yourself.</h2>
      </div>
    </Paper>
  );
}