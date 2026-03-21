import { useState, useEffect, useContext } from 'react';
import styles from './currentPet.module.css';
import { Box, Stack, LinearProgress, Typography } from '@mui/material';

export default function CurrentPet() {
  return (
    <div className={styles.CurrentPet}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 'fit-content' }}>
        <div className={styles.CurrentPetContent}>
          <div className={styles.CurrentPetImage}>
            <img src="/Melt Human.gif" alt="Pet" />
          </div>
          <div className={styles.CurrentPetInfo}>
            <Typography variant="h5" sx={{mb: '0.25rem'}}>Your Pet</Typography>
            <Typography sx={{mb: '0.75rem'}}>Melt Human</Typography>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={30} color="primary" />
              <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={50} color="secondary" />
              <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={15} color="primary" />
            </Stack>
          </div>
        </div>
      </Box>
    </div>
  )
}