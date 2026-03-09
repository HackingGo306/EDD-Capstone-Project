"use client";

import { useState } from "react";
import styles from "./page.module.css";
import AccountCard from "@/components/account card/accountCard";
import { ThemeProvider } from '@mui/material/styles';
import { CUSTOM_THEME } from "@/utils/config";
import WaterPopup from "@/components/waterpopup/waterpopup";
import EyePopup from "@/components/eyepopup/eyepopup";
import StretchPopup from "@/components/stretchpopup/stretchpopup";
import EvolvingPopup from "@/components/evolvingpopup/evolvingpopup";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import ResponsiveAppBar from "@/components/navbar/navbar";
import LineChartStats from "@/components/line chart/linechart";

export default function Settings() {

  const [isWaterPopupOpen, setIsWaterPopupOpen] = useState(false);
  const [isEyePopupOpen, setIsEyePopupOpen] = useState(false);
  const [isStretchPopupOpen, setIsStretchPopupOpen] = useState(false);
  const [isEvolvingPopupOpen, setIsEvolvingPopupOpen] = useState(false);

  return (
    <ThemeProvider theme={CUSTOM_THEME}>
      <div className={styles.page}>
        <div className={styles.Dashboard}>
          <ResponsiveAppBar />
          <Grid container spacing={2} sx={{ margin: 2 }}>
            <Grid size={4}>
              <AccountCard />
            </Grid>
            <Grid size={4}>
              <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
                <Typography variant="h5" align="center" sx={{fontFamily: "Cormorant Garamond"}} gutterBottom>
                  Great Job!
                  <LineChartStats />
                </Typography>
              </Box>
            </Grid>
            <Grid size={4}>
              <Stack spacing={1}>
                <Button variant="outlined" color="primary">Evolving Reminder</Button>
                <Button variant="outlined" color="primary">One</Button>
                <Button variant="outlined" color="primary" onClick={() => setIsEyePopupOpen(true)}>Open Eye</Button>
              </Stack>
            </Grid>
            <Grid size={8}>
              <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                Pet Information Here
              </Container>
            </Grid>
            <Grid size={4}>
              <Button variant="contained" color="primary" fullWidth onClick={() => setIsEvolvingPopupOpen(true)}>
                Evolving Reminder
              </Button>
            </Grid>
          </Grid>

          {isWaterPopupOpen && <WaterPopup setIsWaterPopupOpen={setIsWaterPopupOpen} />}

          {isEyePopupOpen && <EyePopup setIsEyePopupOpen={setIsEyePopupOpen} />}

          {isStretchPopupOpen && <StretchPopup setIsStretchPopupOpen={setIsStretchPopupOpen} />}

          {isEvolvingPopupOpen && <EvolvingPopup setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} />}
        </div>
      </div>
    </ThemeProvider>
  );
}