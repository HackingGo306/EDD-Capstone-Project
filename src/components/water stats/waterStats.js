import Box from '@mui/material/Box';
import { useState, useEffect, useContext } from 'react';
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';
import { UserInfoContext } from '@/utils/contexts';

export default function WaterStats() {

  const [userActivities, setUserActivities] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [xLabels, setXLabels] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  const { userInfo } = useContext(UserInfoContext);

  useEffect(() => {
    if (!userInfo.activities?.length) {
      setUserActivities([]);
      setWaterData([]);
      return;
    }
    setUserActivities(userInfo.activities);
    setXLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  }, [userInfo]);

  useEffect(() => {
    if (userActivities.length > 0) {
      const activities = userActivities.sort((a, b) => a.timestamp - b.timestamp);
      const newWaterData = new Array(7).fill(0);
      const startDay = (new Date(Date.now()).getDay()) % 7;
      const rotated = xLabels.slice(startDay - 7).concat(xLabels.slice(0, startDay - 7));
      setXLabels(rotated);

      for (let i = 0; i < activities.length; i++) {
        if (activities[i].timestamp * 1000 < Date.now() - 6 * 24 * 60 * 60 * 1000) continue;
        if (activities[i].type === 'water') {
          const dayIndex = (new Date(activities[i].timestamp * 1000).getDay() - startDay + 6) % 7;
          newWaterData[dayIndex] += activities[i].time;
        }
      }

      setWaterData(newWaterData);
    }
  }, [userActivities]);

  return (
    <div>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', padding: 1, paddingBottom: 0, marginTop: 1 }}>
        <Typography variant="h6" align="center" sx={{ fontFamily: "Cormorant Garamond" }} gutterBottom>
          Water Break
        </Typography>
        <LineChart
          series={[{ data: waterData, label: 'Fluid Ounces', area: true, showMark: false }]}
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