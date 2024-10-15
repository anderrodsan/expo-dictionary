import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  clearAllData,
  downloadJSONData,
  fetchSavedWords,
  uploadJSONData,
} from "../../data/actions";

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
import CustomAlert from "../../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageList } from "../../lib/store/store";

export default function Profile() {
  const [savedWords, setSavedWords] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  //zuztand global state for languages
  const { langList } = useLanguageList();

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
      name: "Total Words",
      icon: "",
      className: "bg-blue-500",
      value: savedWords?.length || 0,
    },
    {
      name: "Languages",
      icon: "",
      className: "border-slate-700",
      value: langList?.length || 0,
    },
    {
      name: "Liked",
      icon: "",
      className: "border-blue-500",
      value: savedWords?.filter((word) => word.fav === true).length || 0,
    },
    {
      name: "Known",
      icon: "",
      className: "border-slate-700",
      value: savedWords?.filter((word) => word.status === "Easy").length || 0,
    },
    {
      name: "Learning",
      icon: "",
      className: "border-slate-700",
      value: savedWords?.filter((word) => word.status === "Medium").length || 0,
    },
    {
      name: "Challenging",
      icon: "",
      className: "border-slate-700",
      value: savedWords?.filter((word) => word.status === "Hard").length || 0,
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

  const [alertVisible, setAlertVisible] = useState(false);
  const [newData, setNewData] = useState(null);

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
            <View key={category.name} className={`p-1 w-1/2 `}>
              <View
                className={`px-5 py-3 rounded-xl border ${category.className}`}
              >
                <View className="flex flex-row items-center space-x-2">
                  <Text
                    className={`font-bold ${
                      category.name === "Total Words"
                        ? "text-white"
                        : "text-blue-500"
                    }`}
                  >
                    {category.name}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-start space-x-[6px]">
                  <Text className="text-white text-lg opacity-90">
                    {category.value}
                  </Text>
                  {category.name !== "Languages" && (
                    <Text className="text-white text-lg opacity-90">Words</Text>
                  )}
                </View>
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
                savedWords?.filter(
                  (word) => word.date === new Date().toISOString().split("T")[0]
                ).length || 0
              }{" "}
              Words
            </Text>
          </View>
        </View>

        {/** Number of words saved in the last 7 days */}
        <View className="px-5">
          <View className="px-5 py-3 rounded-xl bg-slate-700">
            <Text className="font-bold text-blue-500">Last 7 days</Text>
            <Text className="text-white text-lg opacity-90">
              {
                //the word.date is in YYYY-MM-DD format
                savedWords?.filter(
                  (word) =>
                    word.date >=
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                ).length || 0
              }{" "}
              Words
            </Text>
          </View>
        </View>

        {/** Number of words saved in the last 30 days */}
        <View className="px-5">
          <View className="px-5 py-3 rounded-xl bg-slate-700">
            <Text className="font-bold text-blue-500">Last 30 days</Text>
            <Text className="text-white text-lg opacity-90">
              {
                //the word.date is in YYYY-MM-DD format
                savedWords?.filter(
                  (word) =>
                    word.date >=
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                ).length || 0
              }{" "}
              Words
            </Text>
          </View>
        </View>

        <View className="px-5 pt-5">
          <Text className="text-white font-bold text-xl">Backup</Text>

          {/* Download JSON file */}
          <View className="flex-row pt-2 gap-3 opacity-70">
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color="white"
            />
            <Text className="text-white text-xs pr-5">
              Download the data as a JSON file, so you can import it to another
              device and not lose your data.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => downloadJSONData(savedWords)}
            className="mt-3 p-5 bg-blue-500/50 rounded-xl flex flex-row items-center space-x-2"
          >
            <MaterialCommunityIcons name="download" size={24} color="#cbd5e1" />
            <Text className="text-slate-300 text-lg">Download data (JSON)</Text>
          </TouchableOpacity>

          {/** Upload JSON file */}
          <View className="flex-row pt-2 gap-3 opacity-70 mt-1">
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color="white"
            />
            <Text className="text-white text-xs pr-5">
              Import your data from a JSON file, but have in mind the current
              data will be rewriten and the old data will be lost.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              uploadJSONData().then((data) => {
                console.log(data);
              });
              onRefresh();
            }}
            className="mt-3 p-5 bg-blue-500/50 rounded-xl flex flex-row items-center space-x-2"
          >
            <MaterialCommunityIcons name="upload" size={24} color="#cbd5e1" />
            <Text className="text-slate-300 text-lg">Upload data (JSON)</Text>
          </TouchableOpacity>
        </View>

        {/** Delete data */}
        <View className="px-5 pt-5 pb-10">
          <Text className="text-white font-bold text-xl">Delete</Text>
          <View className="flex-row gap-3 opacity-70 pt-2">
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color="white"
            />
            <Text className="text-white text-xs pr-5">
              Delete all your data and start over from scratch. This action
              cannot be undone, so have it in mind.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => clearAllData()}
            className="mt-3 p-5 bg-red-500/50 rounded-xl flex flex-row items-center space-x-2"
          >
            <MaterialCommunityIcons name="delete" size={24} color="#cbd5e1" />
            <Text className="text-slate-300 text-lg">Delete all data</Text>
          </TouchableOpacity>
        </View>

        {/** Line Chart */}
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title="Overwrite data"
        message="Are you sure you want to overwrite your data?"
        onConfirm={async () => {
          setAlertVisible(false);
          //set the local async storage
          try {
            await AsyncStorage.setItem("savedWords", newData);
            console.log("File uploaded successfully");
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }}
        onCancel={() => {
          setAlertVisible(false);
          setNewData(null);
          setSavedWords(null);
        }}
      />
    </View>
  );
}
