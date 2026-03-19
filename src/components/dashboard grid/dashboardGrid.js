import styles from "./dashboardGrid.module.css"
import { Box, Container, Typography } from "@mui/material";
import AccountCard from "../account card/accountCard";
import GridItem from "../grid item/gridItem";
import PetCanvas from "../pet canvas/petcanvas";
import UserStats from "@/components/user stats/userStats";

export default function DashboardGrid() {
  return (
    <Box
      className={styles.DashboardGrid}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", // two columns
        gridAutoRows: "4px",                   // small row unit
        gridAutoFlow: "dense",                 // enables gap backfilling
        gap: 2
      }}
    >
      <GridItem><AccountCard /></GridItem>
      <GridItem columnSpan={2}>
        <Container style={{ aspectRatio: '3/1', backgroundColor: '#f5f5f5', borderRadius: '1rem', padding: 0 }}>
          <PetCanvas />
        </Container>
      </GridItem>
      <GridItem>
        <UserStats />
      </GridItem>
      <GridItem>
        Hi
      </GridItem>
      <GridItem>Item G</GridItem>
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