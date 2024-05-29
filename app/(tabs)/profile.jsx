import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { fetchSavedWords } from "../../data/actions";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import CategoryChart from "../../components/CategoryChart";
import { Link } from "expo-router";

export default function Profile() {
  const [savedWords, setSavedWords] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
    });
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
    });
    setRefreshing(false);
  }, []);

  const categories = [
    {
      name: "Total Saved",
      value: savedWords.length,
    },
    {
      name: "Known",
      value: savedWords.filter((word) => word.status === "Easy").length,
    },
    {
      name: "Learning",
      value: savedWords.filter((word) => word.status === "Medium").length,
    },
    {
      name: "Challenging",
      value: savedWords.filter((word) => word.status === "Hard").length,
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
    <View className="bg-slate-800 flex-1 flex-col justify-start">
      <View className="flex-row items-center px-5 py-4 border-b border-slate-700">
        <MaterialCommunityIcons name="account" size={24} color="white" />
        <Text className="flex-1 text-white text-xl font-bold pl-3">
          Profile
        </Text>
        <TouchableOpacity
          className="p-2 bg-slate-700 rounded-xl"
          activeOpacity={0.75}
        >
          <Link href={"/json"} className="flex flex-row items-center space-x-3">
            <MaterialCommunityIcons
              name="code-json"
              size={20}
              color="#cbd5e1"
            />
          </Link>
        </TouchableOpacity>
      </View>

      {/** Statistics with charts */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 py-5 space-y-2"
      >
        <View className="flex-row justify-between items-center gap-3 px-5">
          <Text className="flex-1 text-white font-bold text-xl">
            Statistics
          </Text>
        </View>

        {/** Number of words by categories */}
        <View className="flex flex-row flex-wrap justify-between px-4">
          {categories.map((category) => (
            <View key={category.name} className="w-1/2 p-1">
              <View className="px-5 py-3 rounded-xl border border-slate-700">
                <Text className="font-bold text-blue-500">{category.name}</Text>
                <Text className="text-white text-lg opacity-90">
                  {category.value} Words
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/** Pie Chart with words  -- Causes crash
        <CategoryChart categories={categories} />
        */}

        {/** Number of words saved today */}
        <View className="px-5">
          <View className="px-5 py-3 rounded-xl bg-slate-700">
            <Text className="font-bold text-blue-500">Today</Text>
            <Text className="text-white text-lg opacity-90">
              {
                //the word.date is in YYYY-MM-DD format
                savedWords.filter(
                  (word) => word.date === new Date().toISOString().split("T")[0]
                ).length
              }{" "}
              Words
            </Text>
          </View>
        </View>

        {/** Line Chart */}
      </ScrollView>
    </View>
  );
}
