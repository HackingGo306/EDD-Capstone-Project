import { useState, useEffect, useContext } from "react";
import styles from "./breakInformation.module.css";
import { UserInfoContext } from "@/utils/contexts";
import { Typography, Chip, Container, Button } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { RefreshContext } from "@/utils/contexts";

export default function BreakInformation({ setIsEyePopupOpen, setIsWaterPopupOpen, setIsStretchPopupOpen }) {
  const [nextWaterTime, setNextWaterTime] = useState(0);
  const [nextEyeTime, setNextEyeTime] = useState(0);
  const [nextStretchTime, setNextStretchTime] = useState(0);

  const [waterTimeLeft, setWaterTimeLeft] = useState(0);
  const [eyeTimeLeft, setEyeTimeLeft] = useState(0);
  const [stretchTimeLeft, setStretchTimeLeft] = useState(0);

  const { timerRefresh } = useContext(RefreshContext);

  const { userInfo } = useContext(UserInfoContext);

  useEffect(() => {
    // Calculate the next water break time
    if (!userInfo.activities) return;
    if (!userInfo.activities.length) return;

    const sessionOpened = Math.floor(parseInt(sessionStorage.login) / 1000) || Date.now() / 1000;
    if (!sessionStorage.wb) sessionStorage.setItem("wb", sessionOpened);
    if (!sessionStorage.eb) sessionStorage.setItem("eb", sessionOpened);
    if (!sessionStorage.sb) sessionStorage.setItem("sb", sessionOpened);

    const sessionWaterTime = parseInt(sessionStorage.wb);
    const sessionEyeTime = parseInt(sessionStorage.eb);
    const sessionStretchTime = parseInt(sessionStorage.sb);

    // Find the latest water break (greatest id)
    const latestWaterBreak = userInfo.activities.reduce((max, activity) => {
      if (activity.type === "water") {
        return activity.activity_id > max.activity_id ? activity : max;
      }
      return max;
    });
    const latestEyeBreak = userInfo.activities.reduce((max, activity) => {
      if (activity.type === "eye") {
        return activity.activity_id > max.activity_id ? activity : max;
      }
      return max;
    });
    const latestStretchBreak = userInfo.activities.reduce((max, activity) => {
      if (activity.type === "stretch") {
        return activity.activity_id > max.activity_id ? activity : max;
      }
      return max;
    });

    const prevWaterTime = Math.max(latestWaterBreak.timestamp, sessionWaterTime);
    const prevEyeTime = Math.max(latestEyeBreak.timestamp, sessionEyeTime);
    const prevStretchTime = Math.max(latestStretchBreak.timestamp, sessionStretchTime);

    setNextEyeTime(prevEyeTime + 20 * 60);
    setNextWaterTime(prevWaterTime + 20 * 60);
    setNextStretchTime(prevStretchTime + 20 * 60);

  }, [userInfo, timerRefresh]);

  useEffect(() => {

    if (nextEyeTime === 0 || nextWaterTime === 0 || nextStretchTime === 0) return;

    const eyeInterval = setInterval(() => {
      setEyeTimeLeft(Math.ceil((nextEyeTime - Date.now() / 1000) / 60));
      if (Date.now() / 1000 > nextEyeTime) {
        setIsEyePopupOpen(true);
      }
    }, 1000);

    const waterInterval = setInterval(() => {
      setWaterTimeLeft(Math.ceil((nextWaterTime - Date.now() / 1000) / 60));
      if (Date.now() / 1000 > nextWaterTime) {
        setIsWaterPopupOpen(true);
      }
    }, 1000);

    const stretchInterval = setInterval(() => {
      setStretchTimeLeft(Math.ceil((nextStretchTime - Date.now() / 1000) / 60));
      if (Date.now() / 1000 > nextStretchTime) {
        setIsStretchPopupOpen(true);
      }
    }, 1000);

    return () => {
      clearInterval(eyeInterval);
      clearInterval(waterInterval);
      clearInterval(stretchInterval);
    };
  }, [userInfo, nextEyeTime, nextWaterTime, nextStretchTime]);

  return (
    <div className={styles.BreakInformation}>
      <div className={styles.BreakInfoHeader}>
        <Typography variant="h6" sx={{ fontFamily: "Cormorant Garamond" }}>
          Break Info
        </Typography>
        <SettingsIcon sx={{ ':hover': { cursor: 'pointer' } }} />
      </div>
      <Chip
        label={`Next Water Break: ${waterTimeLeft} minutes`}
        color="primary"
        variant="filled"
        size="medium"
        className={styles.chip}
        onClick={() => {
          console.log("hi")
        }}
        onDelete={() => {
          console.log("bye");
        }}
        deleteIcon={<RestartAltIcon />}
        sx={{
          '& .MuiChip-deleteIcon': {
            color: 'rgba(0, 0, 0, 0.4)', // Default color
            '&:hover': {
              color: 'rgba(212, 151, 238, 1)', // Color on hover for the icon only
              transition: 'color 0.3s ease',
            },
          },
        }}
      />
      <br />
      <Chip
        label={`Next Stretch Break: ${stretchTimeLeft} minutes`}
        color="primary"
        variant="filled"
        size="medium"
        className={styles.chip}
        onClick={() => {
          console.log("hi")
        }}
        onDelete={() => {
          console.log("bye");
        }}
        deleteIcon={<RestartAltIcon />}
        sx={{
          '& .MuiChip-deleteIcon': {
            color: 'rgba(0, 0, 0, 0.4)', // Default color
            '&:hover': {
              color: 'rgba(212, 151, 238, 1)', // Color on hover for the icon only
              transition: 'color 0.3s ease',
            },
          },
        }}
      />
      <br />
      <Chip
        label={`Next Eye Break: ${eyeTimeLeft} minutes`}
        color="primary"
        variant="filled"
        size="medium"
        className={styles.chip}
        onClick={() => {
          console.log("hi")
        }}
        onDelete={() => {
          console.log("bye");
        }}
        deleteIcon={<RestartAltIcon />}
        sx={{
          '& .MuiChip-deleteIcon': {
            color: 'rgba(0, 0, 0, 0.4)', // Default color
            '&:hover': {
              color: 'rgba(212, 151, 238, 1)', // Color on hover for the icon only
              transition: 'color 0.3s ease',
            },
          },
        }}
      />
    </div>
  );
}