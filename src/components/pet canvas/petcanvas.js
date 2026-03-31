import { useRef, useEffect, useCallback, useContext } from "react";
import styles from './petcanvas.module.css'
import { useWindowSize } from "@react-hook/window-size";
import { PetsContext, UserInfoContext } from "@/utils/contexts";
import { Box, Typography } from "@mui/material";
import { petImg } from "@/utils/tools";

const dist = function (x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

const rectContain = function (x, y, w, h, mx, my) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

export default function PetCanvas() {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [width, height] = useWindowSize();
  const { pets, refreshPets } = useContext(PetsContext);
  const { userInfo } = useContext(UserInfoContext);

  // Canvas related variables
  const mouseRef = useRef({ x: 0, y: 0 });
  const clickRef = useRef(false);
  const selectedPetRef = useRef({});

  useEffect(() => {
    refreshPets();
  }, [userInfo]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const dpi = window.devicePixelRatio;

    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);

    return { scaleX: style_width * dpi, scaleY: style_height * dpi };

  }, [canvasRef, width, height]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!pets.length || !userInfo.loggedIn) return;

    let drawnPets = [];
    // Create a deep copy
    for (let i = 0; i < pets.length; i++) {
      drawnPets.push({
        ...pets[i]
      });
    }

    const { scaleX, scaleY } = resizeCanvas();

    const ctx = canvasRef.current.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const scaleFactor = scaleX / 300;
    ctx.scale(scaleFactor, scaleFactor);

    const draw = function () {
      canvasRef.current.style.cursor = "unset";
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      ctx.clearRect(0, 0, 300, 100);

      var radgrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 200);
      radgrad.addColorStop(0, '#d490ffff');
      radgrad.addColorStop(1, 'rgba(212, 125, 255, 0)');

      var radgrad2 = ctx.createRadialGradient(300, 100, 1, 300, 100, 200);
      radgrad2.addColorStop(0, '#9ed5ffff');
      radgrad2.addColorStop(1, 'rgba(133, 218, 255, 0)');

      ctx.fillStyle = radgrad2;
      ctx.fillRect(0, 0, 300, 100);
      ctx.fillStyle = radgrad;
      ctx.fillRect(0, 0, 300, 100);

      for (let i = 0; i < drawnPets.length; i++) {
        ctx.beginPath();

        if (!drawnPets[i].x) {
          drawnPets[i].x = Math.random() * 280;
        }
        if (!drawnPets[i].y) {
          drawnPets[i].y = Math.random() * 80;
        }
        if (!drawnPets[i].vx) {
          drawnPets[i].vx = Math.floor(Math.random() * 2) - 1;
        }
        if (!drawnPets[i].vy) {
          drawnPets[i].vy = Math.floor(Math.random() * 2) - 1;
        }

        //LATER: set countdown to change directions every few seconds
        drawnPets[i].x += 0.3 * drawnPets[i].vx;
        drawnPets[i].y += 0.3 * drawnPets[i].vy;

        const img = new Image();
        img.src = petImg(drawnPets[i].type, drawnPets[i].level, drawnPets[i].xp);

        if (drawnPets[i].x >= 270 || drawnPets[i].x <= 0) {
          drawnPets[i].vx *= -1;
        }
        if (drawnPets[i].y >= 80 || drawnPets[i].y <= 0) {
          drawnPets[i].vy *= -1;
        }

        ctx.drawImage(img, drawnPets[i].x, drawnPets[i].y, 30, 30);
        if (dist(mouseX, mouseY, drawnPets[i].x + 15, drawnPets[i].y + 15) < 10) {
          canvasRef.current.style.cursor = "pointer";
          if (clickRef.current) {
            selectedPetRef.current = drawnPets[i];
          }
        }
      }

      if (selectedPetRef.current.name) { // Draw pet info on right side
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.rect(225, 0, 75, 100);
        ctx.fill();

        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(selectedPetRef.current.name, 262.5, 10, 75);

        ctx.beginPath();
        ctx.fillStyle = "rgba(219, 109, 255, 0.8)";
        ctx.rect(240, 17, 45, 45);
        ctx.fill();

        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(((Date.now() / 1000 - selectedPetRef.current.created_at) / (24 * 60 * 60)).toFixed(2) + " days old", 262.5, 80, 45);

        // "Close" button on the bottom (y = 100)
        ctx.beginPath();
        ctx.fillStyle = "rgb(113, 113, 113)";
        ctx.rect(240, 90, 45, 7.5);
        ctx.fill();

        ctx.font = "4px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("Close", 262.5, 95, 45);

        if (rectContain(240, 90, 45, 7.5, mouseX, mouseY)) {
          canvasRef.current.style.cursor = "pointer";
          if (clickRef.current) {
            selectedPetRef.current = {};
          }
        }
      }

      requestRef.current = requestAnimationFrame(draw);
    }
    requestRef.current = requestAnimationFrame(draw);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [width, height, pets, userInfo]);

  const getMouse = useCallback((e) => {
    var rect = canvasRef.current.getBoundingClientRect();
    let mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * 300,
      mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * 100;

    mouseRef.current = { x: mouseX, y: mouseY };
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.addEventListener("mousemove", getMouse);
    canvasRef.current.addEventListener("mousedown", () => {
      clickRef.current = true;
    });
    canvasRef.current.addEventListener("mouseup", () => {
      clickRef.current = false;
    });
    return () => {
      canvasRef.current.removeEventListener("mousemove", getMouse);
      canvasRef.current.removeEventListener("mousedown", () => {
        clickRef.current = true;
      });
      canvasRef.current.removeEventListener("mouseup", () => {
        clickRef.current = false;
      });
    }
  }, [canvasRef]);

  return (
    <div className={styles.PetCanvas}>
      <div className={styles.NoUser} style={{ display: (userInfo.loggedIn ? "none" : "block")}}>
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: '2rem' }}>
          <Typography variant="h6">Please log in to see your pets!</Typography>
        </Box>
      </div>
      <canvas ref={canvasRef} style={{ display: (userInfo.loggedIn ? "block" : "none")}}></canvas>
    </div>
  )
}