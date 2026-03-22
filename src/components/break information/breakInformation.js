import { useState, useEffect, useContext } from "react";
import styles from "./breakInformation.module.css";
import { UserInfoContext } from "@/utils/contexts";
import { Typography, alpha } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { RefreshContext } from "@/utils/contexts";
import {List, ListItem, ListItemText} from '@mui/material'

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
      setEyeTimeLeft(Math.max(0, Math.ceil((nextEyeTime - Date.now() / 1000) / 60)))
      if (Date.now() / 1000 > nextEyeTime) {
        setIsEyePopupOpen(true);
      }
    }, 1000);

    const waterInterval = setInterval(() => {
      setWaterTimeLeft(Math.max(0, Math.ceil((nextWaterTime - Date.now() / 1000) / 60)));
      if (Date.now() / 1000 > nextWaterTime) {
        setIsWaterPopupOpen(true);
      }
    }, 1000);

    const stretchInterval = setInterval(() => {
      setStretchTimeLeft(Math.max(0, Math.ceil((nextStretchTime - Date.now() / 1000) / 60)));
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
      <List dense>
        <ListItem
          sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.75), borderRadius: '1rem', mb: 1, py: 0 }}
          secondaryAction={<RestartAltIcon sx={{ ':hover': { cursor: 'pointer' } }} />}
        >
          <ListItemText
            primary="Water Break"
            secondary={`in ${waterTimeLeft} minutes`}
          />
        </ListItem>
        <ListItem
          sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.75), borderRadius: '1rem', mb: 1, py: 0 }}
          secondaryAction={<RestartAltIcon sx={{ ':hover': { cursor: 'pointer' } }} />}
        >
          <ListItemText
            primary="Stretch Break"
            secondary={`in ${stretchTimeLeft} minutes`}
          />
        </ListItem>
        <ListItem
          sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.75), borderRadius: '1rem', py: 0 }}
          secondaryAction={<RestartAltIcon sx={{ ':hover': { cursor: 'pointer' } }} />}
        >
          <ListItemText
            primary="Eye Break"
            secondary={`in ${eyeTimeLeft} minutes`}
          />
        </ListItem>
      </List>
    </div>
  );
}