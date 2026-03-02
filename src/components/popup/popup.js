"use client";

import { Paper, alpha } from "@mui/material";
import styles from "./popup.module.css";

export default function Popup() {

  return (
    <Paper className={styles.Popup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5) }}>
      <div className={styles.PopupContent}>
        <h1>Popup</h1>
      </div>
    </Paper>
  );
}