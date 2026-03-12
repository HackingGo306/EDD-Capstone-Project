import styles from "./dashboardGrid.module.css"
import { useRef, useEffect, useState } from "react"
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import LineChartStats from "@/components/line chart/linechart";
import AccountCard from "../account card/accountCard";
import GridItem from "../grid item/gridItem";
import { getUserActivities, beginUserActivity } from "@/api/ActivitiesAPI";

export default function DashboardGrid() {


  const fetchActivities = async () => {
    const data = await getUserActivities();
    console.log(data);
  }

  const addActivity = async () => {
    await beginUserActivity({ type: "eye" });
  }

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
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', backgroundColor: '#f5f5f5', borderRadius: '1rem', padding: 0 }}>
          <div className={styles.BannerImg}>
            <img src="/purpleBanner.jpg" alt="Pet Image" />
          </div>
        </Container>
      </GridItem>
      <GridItem>
        <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 2 }}>
          <Typography variant="h5" align="center" sx={{ fontFamily: "Cormorant Garamond" }} gutterBottom>
            Great Job!
            <LineChartStats />
          </Typography>
        </Box>
      </GridItem>
      <GridItem>
        <Stack spacing={1}>
          <Button variant="outlined" color="primary">Evolving Reminder</Button>
          <Button variant="outlined" color="primary">One</Button>
          <Button variant="outlined" color="primary">Open Eye</Button>
        </Stack>
      </GridItem>
      <GridItem>
        <Button variant="outlined" color="primary" onClick={() => { fetchActivities(); }}>
          Click to see
        </Button>
      </GridItem>
      <GridItem>
        <Button variant="outlined" color="primary" onClick={() => { addActivity(); }}>
          Click to add
        </Button>
      </GridItem>
      <GridItem>Item G</GridItem>
      <GridItem>Item H</GridItem>
      <GridItem>Item I</GridItem>
      <GridItem>Item J</GridItem>
      <GridItem>Item K</GridItem>
      <GridItem>
        <Button variant="outlined" color="primary" onClick={() => { addActivity(); }}>
          Click to add
        </Button>
      </GridItem>
    </Box>
  );
}