"use client";

import { useState, useCallback, useEffect, useContext } from "react";
import styles from "./eyepopup.module.css";
import { Typography } from "@mui/material";
import { Paper, alpha } from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import ChooseConfetti from "../choose confetti/chooseconfetti";
import { beginUserActivity, endUserActivity } from "@/api/ActivitiesAPI";
import { UserInfoContext } from "@/utils/contexts";

export default function EyePopup({ setIsEyePopupOpen }) {

  const [progress, setProgress] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const {refreshUserInfo} = useContext(UserInfoContext);

  const startTimer = useCallback(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setIsTimerFinished(true);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 200); // Update every 200ms for a total of 20 seconds

    setIsTimerRunning(true);
    beginUserActivity({ type: "eye" });

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      endUserActivity();
      refreshUserInfo();
    }
  }, [progress]);

  return (
    <Paper className={styles.EyePopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.9) }}>
      <div className={styles.PopupContent}>

        { // No break = angry, during break = hide, break done = happy
          (() => {
            if (isTimerRunning) {
              return <div />;
            } else if (isTimerFinished) {
              return <img src="/Smirk Human.gif" alt="Pet" width={300} height={300} />;
            } else {
              return <img src="/Dry Eyes Human.gif" alt="Pet" width={300} height={300} />;
            }
          })()
        }

        { // Text dependent on whether the user has finished the eye break or not
          isTimerFinished ?
          <div>
            <Typography variant="h2" sx={{fontFamily: "Chango"}} gutterBottom>Great Job!</Typography>
            <Typography variant="h6">You have finished your eye break!</Typography>
          </div>
          :
          <div>
            <Typography variant="h1">EYE BREAK!</Typography>
            <Typography variant="h6">Time to take care of your eyes. Stare <b>20</b> feet away for <b>20</b> seconds.</Typography>
            <Typography variant="h6">Don't let your pet die!</Typography>
          </div>
        }

        <div className={styles.ProgressContainer}>

          { //Begin and Skip Buttons
            !(progress > 0 || isTimerFinished || isTimerRunning) && <div>
              <Button sx={{ backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.8) }} variant="contained" color="secondary" onClick={startTimer}>Begin</Button>
              <Button sx={{ ml: "0.5rem" }} variant="outlined" color="secondary" onClick={() => setIsEyePopupOpen(false)}>Skip</Button>
            </div>
          }

          { // Progress Circle
            isTimerRunning &&
            <div>
              <CircularProgress enableTrackSlot variant="determinate" color="secondary" size={75} value={progress} />
              <Typography variant="h6" sx={{ mt: "0.5rem" }}>{`${Math.round(progress)}%`}</Typography>
            </div>
          }

          { // Celebrate and Done Buttons
            isTimerFinished && <div>
              <ChooseConfetti text={"Celebrate 🎉🎉🎉"} />
              <Button sx={{ mt: "0.5rem"}} variant="outlined" color="secondary" onClick={() => setIsEyePopupOpen(false)}>Done</Button>
            </div>
          }
        </div>
      </div>
    </Paper>
  );
}