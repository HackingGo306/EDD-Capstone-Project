import styles from "./dashboardGrid.module.css"
import { Box, Container } from "@mui/material";
import AccountCard from "../account card/accountCard";
import GridItem from "../grid item/gridItem";
import PetCanvas from "../pet canvas/petcanvas";
import UserStats from "@/components/user stats/userStats";
import BreakInformation from "../break information/breakInformation";
import QuoteHolder from "../quote holder/quoteHolder";
import WeekInfo from "../week info/weekInfo";
import CurrentPet from "../current pet/currentPet";
import WaterStats from "../water stats/waterStats";

export default function DashboardGrid({ isEyePopupOpen, isWaterPopupOpen, isStretchPopupOpen, setIsWaterPopupOpen, setIsEyePopupOpen, setIsStretchPopupOpen, setIsEvolvingPopupOpen, setIsChoosePetPopupOpen }) {
  return (
    <Box
      className={styles.DashboardGrid}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)", // six columns
        gridAutoRows: "2px",                   // small row unit
        gridAutoFlow: "dense",                 // enables gap backfilling
        gap: 2,
        overflow: "hidden",
      }}
    >
      <GridItem columnSpan={2}>
        <AccountCard />
      </GridItem>
      <GridItem columnSpan={4}>
        <Container style={{ aspectRatio: '3/1', borderRadius: '1rem', padding: 0, marginBottom: '0.75rem' }}>
          <PetCanvas />
        </Container>
        <WeekInfo/>
      </GridItem>
      <GridItem columnSpan={2}>
        <UserStats />
      </GridItem>
      <GridItem columnSpan={2}>
        <WaterStats />
      </GridItem>
      <GridItem columnSpan={1}>
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 'fit-content' }}>
          <BreakInformation isEyePopupOpen={isEyePopupOpen} isWaterPopupOpen={isWaterPopupOpen} isStretchPopupOpen={isStretchPopupOpen} setIsEyePopupOpen={setIsEyePopupOpen} setIsWaterPopupOpen={setIsWaterPopupOpen} setIsStretchPopupOpen={setIsStretchPopupOpen} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} setIsChoosePetPopupOpen={setIsChoosePetPopupOpen} />
        </Box>
      </GridItem>
      <GridItem columnSpan={2}>
        <CurrentPet />
      </GridItem>
      <GridItem columnSpan={1}>
        <QuoteHolder />
      </GridItem>
    </Box>
  );
} 