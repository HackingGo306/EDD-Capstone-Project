import styles from "./breakChart.module.css";
import { Typography } from "@mui/material";
import LineChartStats from "../user stats/userStats";

export default function BreakChart() {
  return <div>
    <Typography variant="h5" align="center" sx={{ fontFamily: "Cormorant Garamond" }} gutterBottom>
      Great Job!
      <LineChartStats />
    </Typography>
  </div>
}