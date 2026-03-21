import styles from "./dashboardGrid.module.css"
import { Box, Container, Typography } from "@mui/material";
import AccountCard from "../account card/accountCard";
import GridItem from "../grid item/gridItem";
import PetCanvas from "../pet canvas/petcanvas";
import UserStats from "@/components/user stats/userStats";
import BreakInformation from "../break information/breakInformation";
import QuoteHolder from "../quote holder/quoteHolder";

export default function DashboardGrid({ setIsWaterPopupOpen, setIsEyePopupOpen, setIsStretchPopupOpen, setIsEvolvingPopupOpen, setIsChoosePetPopupOpen }) {
  return (
    <Box
      className={styles.DashboardGrid}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)", // six columns
        gridAutoRows: "4px",                   // small row unit
        gridAutoFlow: "dense",                 // enables gap backfilling
        gap: 2
      }}
    >
      <GridItem columnSpan={2}>
        <AccountCard />
      </GridItem>
      <GridItem columnSpan={4}>
        <Container style={{ aspectRatio: '3/1', borderRadius: '1rem', padding: 0 }}>
          <PetCanvas />
        </Container>
      </GridItem>
      <GridItem columnSpan={2}>
        <UserStats />
      </GridItem>
      <GridItem columnSpan={1}>
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2, paddingTop: 1, height: 'fit-content' }}>
          <BreakInformation setIsEyePopupOpen={setIsEyePopupOpen} setIsWaterPopupOpen={setIsWaterPopupOpen} setIsStretchPopupOpen={setIsStretchPopupOpen} setIsEvolvingPopupOpen={setIsEvolvingPopupOpen} setIsChoosePetPopupOpen={setIsChoosePetPopupOpen} />
        </Box>
      </GridItem>
      <GridItem columnSpan={3}>
        <QuoteHolder />
      </GridItem>
      <GridItem>Item H</GridItem>
      <GridItem>Item I</GridItem>
      <GridItem>Item J</GridItem>
      <GridItem>
        Hi
      </GridItem>
      <GridItem>
        Hi
      </GridItem>
    </Box>
  );
}