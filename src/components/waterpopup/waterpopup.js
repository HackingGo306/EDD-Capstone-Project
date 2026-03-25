"use client";

import styles from "./waterpopup.module.css";
import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { TextField, Typography } from "@mui/material";
import { Paper, alpha } from "@mui/material";
import { Button } from "@mui/material";
import ChooseConfetti from "../choose confetti/chooseconfetti";
import { beginUserActivity, endUserActivity } from "@/api/ActivitiesAPI";
import Webcam from "react-webcam";
import { PetsContext, UserInfoContext } from "@/utils/contexts";
import { petDictionary } from "@/utils/tools";

import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";


export default function WaterPopup({ setIsWaterPopupOpen, triggerTimerRefresh }) {

  const [progress, setProgress] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const { userInfo, refreshUserInfo } = useContext(UserInfoContext);
  const { pets, refreshPets } = useContext(PetsContext);
  const [currentPet, setCurrentPet] = useState({ type: '', level: 0 });

  const [model, setModel] = useState(undefined);
  const cameraRef = useRef(null);

  useEffect(() => {
    cocoSsd.load().then((model) => {
      console.log(model, "loaded");
      setModel(model);
    });
  }, []);

  useEffect(() => {
    if (!userInfo?.loggedIn) return;
    if (!pets?.length) return;

    const userPet = pets.find((pet) => pet.pet_id == userInfo.data.pet);
    if (!userPet) return;
    setCurrentPet(userPet);
  }, [pets, userInfo]);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    beginUserActivity({ type: "water" });
  }, [progress]);

  useEffect(() => {
    // get camera stream and load coco model
    if (!model) return;
    if (isTimerRunning) {
      const getPredictions = async () => {
        const b64data = cameraRef.current.getScreenshot();
        if (!b64data) return;
        const { videoWidth, videoHeight } = cameraRef.current.video;
        const htmlImage = new Image();
        htmlImage.src = b64data;
        htmlImage.width = videoWidth;
        htmlImage.height = videoHeight;

        // Perform inference
        htmlImage.onload = async () => {
          const predictions = await model.detect(htmlImage);
          console.log(predictions);
        }
      }

      const predictionInterval = setInterval(getPredictions, 100);

      return () => {
        clearInterval(predictionInterval);
      }
    }
  }, [isTimerRunning, cameraRef, model]);

  useEffect(() => {
    if (progress === 100) {
      endUserActivity();
      refreshUserInfo();
    }
  }, [progress]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem("wb", Date.now() / 1000);
    setIsWaterPopupOpen(false);
    triggerTimerRefresh();
  }, [triggerTimerRefresh]);

  return (
    <Paper className={styles.WaterPopup} sx={{ backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.9) }}>
      <div className={styles.PopupContent}>
        { // No break = angry, during break = hide, break done = happy
          (() => {
            if (isTimerRunning) {
              return <div />;
            } else if (isTimerFinished) {
              return <img src={petDictionary[currentPet.type]?.[currentPet.level - 1]} alt="Pet" width={300} height={300} />;
            } else {
              return <img src={petDictionary[currentPet.type]?.[currentPet.level - 1]} alt="Pet" width={300} height={300} />;
            }
          })()
        }

        { // Text dependent on whether the user has finished the water break or not
          isTimerFinished ?
            <div>
              <Typography variant="h2" sx={{ fontFamily: "Chango" }} gutterBottom>Great Job!</Typography>
              <Typography variant="h6">You have finished your water break!</Typography>
            </div>
            :
            <div>
              <Typography variant="h1">WATER BREAK!</Typography>
              <Typography variant="h6">Hydration time! Take a moment to drink some water and refresh yourself.</Typography>
              <Typography variant="h6">Don't let your pet die!</Typography>
            </div>
        }

        <div className={styles.ProgressContainer}>

          { //Begin and Skip Buttons
            !(progress > 0 || isTimerFinished || isTimerRunning) && <div>
              <Button sx={{ backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.8) }} variant="contained" color="secondary" onClick={startTimer}>Begin</Button>
              <Button sx={{ ml: "0.5rem" }} variant="outlined" color="secondary" onClick={handleSkip}>Skip</Button>
            </div>
          }

          { // Progress Circle
            isTimerRunning &&
            <div>
              <Webcam className={styles.WebcamView} ref={cameraRef} width={"50%"} screenshotFormat="image/jpeg" mirrored={true} audio={false}/>
              <br />
              <TextField sx={{ mb: "0.5rem", mt: "0.5rem" }} variant="standard" type="number" color="secondary" label="Amount" onChange={(e) => setPetName(e.target.value)} />
              <br />
              <Button variant="contained" color="secondary" onClick={() => { console.log("click done") }}>Confirm</Button>
              <Button sx={{ ml: "0.5rem" }} variant="contained" color="secondary" onClick={handleSkip}>Skip</Button>
            </div>
          }

          { // Celebrate and Done Buttons
            isTimerFinished && <div>
              <ChooseConfetti text={"Celebrate 🎉🎉🎉"} />
              <Button sx={{ mt: "0.5rem" }} variant="outlined" color="secondary" onClick={() => setIsWaterPopupOpen(false)}>Done</Button>
            </div>
          }
        </div>

      </div>
    </Paper>
  );
}