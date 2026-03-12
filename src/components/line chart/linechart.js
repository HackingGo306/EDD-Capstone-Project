import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { getUserActivities } from '@/api/ActivitiesAPI';

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

export default function BiaxialLineChart() {

  const [userActivities, setUserActivities] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [eyeData, setEyeData] = useState([]);
  const [stretchData, setStretchData] = useState([]);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const activities = await getUserActivities();
        setUserActivities(activities.data);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      }
    };
    fetchUserActivities();
  }, []);

  useEffect(() => {
    if (userActivities.length > 0) {
      for (let i = 0; i < userActivities.length; i++) {

      }
    }
  }, [userActivities]);

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <LineChart
        series={[
          { data: stretchData, label: 'Stretch Break', yAxisId: 'leftAxisId' },
          { data: waterData, label: 'Water Break', yAxisId: 'rightAxisId' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels, height: 28 }]}
        yAxis={[
          { id: 'leftAxisId', width: 50 },
          { id: 'rightAxisId', position: 'right' },
        ]}
      />
    </Box>
  );
}