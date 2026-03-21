"use client";

import { useState, useEffect } from "react";
import styles from "./quoteHolder.module.css";
import { Typography, Box } from "@mui/material";

export default function QuoteHolder() {
  return (
    <div className={styles.QuoteHolder}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2, paddingTop: 1, height: 'fit-content' }}>
        <Typography>
          I am a jelly, and there is no larger jelly than I
        </Typography>
      </Box>
    </div>
  )
}