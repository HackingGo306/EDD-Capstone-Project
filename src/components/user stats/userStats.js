import Box from '@mui/material/Box';
import { useState, useEffect, useContext } from 'react';
import { BarChart } from '@mui/x-charts';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { useTheme } from '@emotion/react';
import { Typography } from '@mui/material';
import { UserInfoContext } from '@/utils/contexts';

export default function UserStats() {

  const [userActivities, setUserActivities] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [eyeData, setEyeData] = useState([]);
  const [stretchData, setStretchData] = useState([]);
  const [xLabels, setXLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  const { userInfo } = useContext(UserInfoContext);

  const theme = useTheme();
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    // theme.palette.tertiary.main,
    // theme.palette.quaternary.main,
  ]

  useEffect(() => {
    if (!userInfo.activities) return;
    console.log(userInfo);
    setUserActivities(userInfo.activities);
  }, [userInfo]);

  useEffect(() => {
    if (userActivities.length > 0) {
      const activities = userActivities.sort((a, b) => a.timestamp - b.timestamp);

      const newWaterData = new Array(7).fill(0);
      const newEyeData = new Array(7).fill(0);
      const newStretchData = Array(7).fill(0);

      const startDay = (new Date(Date.now()).getDay()) % 7;
      console.log(startDay);

      const rotated = xLabels.slice(startDay - 7).concat(xLabels.slice(0, startDay - 7));
      setXLabels(rotated);

      for (let i = 0; i < activities.length; i++) {
        if (activities[i].timestamp * 1000 < Date.now() - 6 * 24 * 60 * 60 * 1000) continue;

        if (activities[i].type === 'water') {
          const dayIndex = (new Date(activities[i].timestamp * 1000).getDay() - startDay + 6) % 7;
          newWaterData[dayIndex] += Math.round(activities[i].time * 100 / 60) / 100;
        } else if (activities[i].type === 'eye') {
          const dayIndex = (new Date(activities[i].timestamp * 1000).getDay() - startDay + 6) % 7;
          newEyeData[dayIndex] += Math.round(activities[i].time * 100 / 60) / 100;
        } else if (activities[i].type === 'stretch') {
          const dayIndex = (new Date(activities[i].timestamp * 1000).getDay() - startDay + 6) % 7;
          newStretchData[dayIndex] += Math.round(activities[i].time * 100 / 60) / 100;
        }
      }

      setWaterData(newWaterData);
      setEyeData(newEyeData);
      setStretchData(newStretchData);
    }
  }, [userActivities]);

  const valueFormatter = (value) => `${value} min`;

  return (
    <div>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, height: 250 }}>
        <Typography variant="h6" align="center" sx={{ fontFamily: "Cormorant Garamond" }} gutterBottom>
          Activity Breakdown
        </Typography>
        <BarChart
          series={[
            { data: stretchData, label: 'Stretch Break', stack: 'total', valueFormatter },
            { data: eyeData, label: 'Eye Break', stack: 'total', valueFormatter },
          ]}
          xAxis={[{ data: xLabels, height: 25 }]}
          yAxis={[
            { id: 'leftAxis', width: 25 },
          ]}
          colors={chartColors}
          height={200}
        />
      </Box>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, marginTop: 1, height: 200 }}>
        <Typography variant="h6" align="center" sx={{ fontFamily: "Cormorant Garamond" }} gutterBottom>
          Water Break
        </Typography>
        <LineChart
          series={[{ data: waterData, label: 'uv', area: true, showMark: false }]}
          xAxis={[{ scaleType: 'point', data: xLabels, height: 25 }]}
          yAxis={[
            { id: 'leftAxis', width: 25 },
          ]}
          colors={['#b2c5f5']}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              display: 'none',
            },
          }}
          height={175}
          hideLegend={true}
        />
      </Box>
    </div>
  );
}