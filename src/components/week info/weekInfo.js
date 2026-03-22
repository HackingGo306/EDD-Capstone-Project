"use client";

import styles from "./weekInfo.module.css";
import { Typography, Box } from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { alpha } from "@mui/material";

export default function WeekInfo() {
  return (
    <div className={styles.WeekInfo}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 'fit-content', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15) }}>
        <Typography variant="h6">This Week:</Typography>
        <Box className={styles.WeekInfoItem}>
          <LocalFireDepartmentIcon sx={{ color: 'rgba(255, 114, 154, 1)', fontSize: '1.5rem', mr: 1 }} />
          Streak: 1
        </Box>
        <Box className={styles.WeekInfoItem}>
          <AccessTimeFilledIcon sx={{ color: 'rgba(225, 159, 255, 1)', fontSize: '1.5rem', mr: 1 }} />
          Break Time: 1 hr
        </Box>
        <Box className={styles.WeekInfoItem}>
          <WaterDropIcon sx={{ color: 'rgba(114, 170, 255, 1)', fontSize: '1.5rem', mr: 1 }} />
          Water: 1 cup
        </Box>
      </Box>
    </div>
  )
}