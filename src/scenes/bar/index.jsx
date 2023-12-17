import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { UserData } from "../../data/mockData";
import { useState } from "react";


const Bar = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "number of students",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
          "#e39666",
          "#e6c8e6",
          "#e6c8ca",
          "#bf1d2a",
          "#adadac",
          "#7992b5",
          "#d1972c",
          "#2a2d64",
          "#c2c2c2",
          "#af3f3b",
          "#2e3e5e",
          

        ],
        // borderColor: "black",
        // borderWidth: 2,
      },
    ],
  });
  return (
    <Box m="20px">
      <Header title="Bar Chart" subtitle="Number of students per hostel" />
      <Box height="75vh">
        <BarChart chartData={userData} />
      </Box>
    </Box>
  );
};

export default Bar;