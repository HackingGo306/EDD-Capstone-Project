"use client";

import { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { ThemeProvider } from '@mui/material/styles';
import { CUSTOM_THEME } from "@/utils/config";
import WaterPopup from "@/components/waterpopup/waterpopup";
import EyePopup from "@/components/eyepopup/eyepopup";
import StretchPopup from "@/components/stretchpopup/stretchpopup";
import EvolvingPopup from "@/components/evolvingpopup/evolvingpopup";
import ResponsiveAppBar from "@/components/navbar/navbar";
import DashboardGrid from "@/components/dashboard grid/dashboardGrid";
import ChoosePetPopup from "@/components/choosepetpopup/choosepetpopup";
import { RefreshContext } from "@/utils/contexts";
import { VAPID_PUBLIC_KEY } from "@/utils/config";

export default function Dashboard() {

  useEffect(() => {
    if (sessionStorage.getItem("login")) return;
    sessionStorage.setItem("login", Date.now());
  }, []);

  useEffect(() => {
    console.log(VAPID_PUBLIC_KEY);
    if ("serviceWorker" in navigator) {
      const handleServiceWorker = async () => {
        const register = await navigator.serviceWorker.register("/sw.js");

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        });

        const res = await fetch("http://localhost:8000/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "content-type": "application/json",
          },
        });

        const data = await res.json();
        console.log(data);
      };
      handleServiceWorker();
    }
  }, [VAPID_PUBLIC_KEY]);

  const { triggerTimerRefresh } = useContext(RefreshContext);

  const [isWaterPopupOpen, setIsWaterPopupOpen] = useState(false);
  const [isEyePopupOpen, setIsEyePopupOpen] = useState(false);
  const [isStretchPopupOpen, setIsStretchPopupOpen] = useState(true);
  const [isEvolvingPopupOpen, setIsEvolvingPopupOpen] = useState(false);
  const [isChoosePetPopupOpen, setIsChoosePetPopupOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  return (
    <ThemeProvider theme={CUSTOM_THEME}>
      <div className={styles.page}>
        <div className={styles.Dashboard}>
          <div className={`${styles.overlay} ${isTimerRunning ? styles.active : styles.hidden}`} />
          <ResponsiveAppBar />
          <br />
          <DashboardGrid setIsWaterPopupOpen={setIsWaterPopupOpen} setIsEyePopupOpen={setIsEyePopupOpen} setIsStretchPopupOpen={setIsStretchPopupOpen} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} setIsChoosePetPopupOpen={setIsChoosePetPopupOpen} />

          {isChoosePetPopupOpen && <ChoosePetPopup setIsChoosePetPopupOpen={setIsChoosePetPopupOpen} />}

          {isWaterPopupOpen && <WaterPopup setIsWaterPopupOpen={setIsWaterPopupOpen} triggerTimerRefresh={triggerTimerRefresh} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} />}

          {isEyePopupOpen && <EyePopup isTimerRunning={isTimerRunning} setIsTimerRunning={setIsTimerRunning} setIsEyePopupOpen={setIsEyePopupOpen} triggerTimerRefresh={triggerTimerRefresh} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} />}

          {isStretchPopupOpen && <StretchPopup setIsStretchPopupOpen={setIsStretchPopupOpen} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} triggerTimerRefresh={triggerTimerRefresh} />}

          {isEvolvingPopupOpen && <EvolvingPopup setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} setIsChoosePetPopupOpen={setIsChoosePetPopupOpen} />}
        </div>
      </div>
    </ThemeProvider>
  );
}