"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { ThemeProvider } from '@mui/material/styles';
import { CUSTOM_THEME } from "@/utils/config";
import WaterPopup from "@/components/waterpopup/waterpopup";
import EyePopup from "@/components/eyepopup/eyepopup";
import StretchPopup from "@/components/stretchpopup/stretchpopup";
import EvolvingPopup from "@/components/evolvingpopup/evolvingpopup";
import ResponsiveAppBar from "@/components/navbar/navbar";
import DashboardGrid from "@/components/dashboard grid/dashboardGrid";

export default function Settings() {

  const [isWaterPopupOpen, setIsWaterPopupOpen] = useState(false);
  const [isEyePopupOpen, setIsEyePopupOpen] = useState(false);
  const [isStretchPopupOpen, setIsStretchPopupOpen] = useState(true);
  const [isEvolvingPopupOpen, setIsEvolvingPopupOpen] = useState(false);

  return (
    <ThemeProvider theme={CUSTOM_THEME}>
      <div className={styles.page}>
        <div className={styles.Dashboard}>
          <ResponsiveAppBar />
          <br />
          <DashboardGrid />

          {isWaterPopupOpen && <WaterPopup setIsWaterPopupOpen={setIsWaterPopupOpen} />}

          {isEyePopupOpen && <EyePopup setIsEyePopupOpen={setIsEyePopupOpen} />}

          {isStretchPopupOpen && <StretchPopup setIsStretchPopupOpen={setIsStretchPopupOpen} />}

          {isEvolvingPopupOpen && <EvolvingPopup setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} />}
        </div>
      </div>
    </ThemeProvider>
  );
}