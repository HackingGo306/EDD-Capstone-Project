import { useState, useEffect, useContext } from 'react';
import styles from './currentPet.module.css';
import { Box, Stack, LinearProgress, Typography } from '@mui/material';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { PetsContext, UserInfoContext } from '@/utils/contexts';
import { petDictionary } from '@/utils/tools.js';

export default function CurrentPet() {
  const [currentPet, setCurrentPet] = useState({ name: '', type: '' });
  const { pets, refreshPets } = useContext(PetsContext);
  const { userInfo, refreshUserInfo } = useContext(UserInfoContext);
  const [xpNeeded, setXpNeeded] = useState(10000);

  useEffect(() => {
    if (!userInfo?.loggedIn) return;
    if (!pets?.length) return;

    const pet = pets.find(pet => pet.pet_id == userInfo.data.pet);
    if (!pet) return;

    const levelThresholds = [10, 90, 300, 750, 1500];
    setXpNeeded(levelThresholds[pet.level]);

    setCurrentPet(pet);
  }, [pets, userInfo]);

  return (
    <div className={styles.CurrentPet}>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 'fit-content' }}>
        <div className={styles.CurrentPetContent}>
          <div className={styles.CurrentPetImage}>
            <img src={petDictionary[currentPet.type]?.[currentPet.level - 1] || "/Human/Melt Human.gif"} alt="Pet" />
          </div>
          <div className={styles.CurrentPetInfo}>
            <Typography variant="h5" sx={{ mb: '0.25rem' }}>{currentPet.name}</Typography>
            <Typography sx={{ mb: '0.75rem' }}>Level {currentPet?.level ?? 0} {currentPet.type.charAt(0).toUpperCase() + currentPet.type.slice(1)}</Typography>
            <Stack sx={{ width: '100%' }} spacing={2}>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ElectricBoltIcon sx={{ color: 'rgba(187, 98, 255, 1)' }} />
                <Box sx={{ width: '100%', mx: 1 }}>
                  <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={currentPet?.energy ?? 0} />
                </Box>
                <Box>
                  <Typography>
                    {currentPet?.energy}/100
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WaterDropIcon sx={{ color: 'rgba(114, 170, 255, 1)' }} />
                <Box sx={{ width: '100%', mx: 1 }}>
                  <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={currentPet?.water ?? 0} color="secondary" />
                </Box>
                <Box>
                  <Typography>
                    {currentPet?.water}/100
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <KeyboardDoubleArrowUpIcon sx={{ color: 'rgba(255, 114, 154, 1)' }} />
                <Box sx={{ width: '100%', mx: 1 }}>
                  <LinearProgress className={styles.CurrentPetProgress} variant="determinate" value={(currentPet?.xp ?? 0) / xpNeeded * 100} color="tertiary" />
                </Box>
                <Box>
                  <Typography>
                    {currentPet?.xp}/{xpNeeded}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </div>
        </div>
      </Box>
    </div>
  )
}