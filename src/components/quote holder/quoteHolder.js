"use client";

import { useState, useEffect } from "react";
import styles from "./quoteHolder.module.css";
import { Typography, Box } from "@mui/material";
import { alpha } from "@mui/material";

export default function QuoteHolder() {
  return (
    <div className={styles.QuoteHolder}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 'fit-content', boxShadow: `0px 0.125rem 0.5rem`, color: (theme) => alpha(theme.palette.primary.main, 0.3) }}>
        <Typography variant="h6" sx={{color: 'black'}}>Quote of the Day:</Typography>
        <div className={styles.QuoteContent}>
          <Typography sx={{color: 'black', fontWeight: '525'}}>
            "I am a jelly, and there is no larger jelly than I."
          </Typography>
          <Typography sx={{color: 'black', fontWeight: '525'}}>
            - Jell'oceronie
          </Typography>
        </div>
      </Box>
    </div>
  )
}