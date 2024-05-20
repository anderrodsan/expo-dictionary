import { Dimensions } from "react-native";
import React from "react";

import { PieChart } from "react-native-chart-kit";

export default function CategoryChart({ categories }) {
  const data = [
    {
      name: "% Known",
      value: Math.round((categories[1].value / categories[0].value) * 100),
      color: "#e2e8f0",
      legendFontColor: "#e2e8f0",
      legendFontSize: 15,
    },
    {
      name: "% Learning",
      //round to 0 decimals and make it percentage 33%
      value: Math.round((categories[2].value / categories[0].value) * 100),
      color: "#94a3b8",
      legendFontColor: "#94a3b8",
      legendFontSize: 15,
    },
    {
      name: "% Hard",
      value: Math.round((categories[3].value / categories[0].value) * 100),
      color: "#64748b",
      legendFontColor: "#64748b",
      legendFontSize: 15,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <PieChart
      data={data}
      width={Dimensions.get("window").width}
      height={220}
      chartConfig={chartConfig}
      accessor={"value"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
      center={[0, 0]}
      absolute
    />
  );
}
