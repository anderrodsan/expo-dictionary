import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

const PastWords = ({ latestWord }) => {
  /*
  const [savedWords, setSavedWords] = useState([]);

  const fetchSavedWords = async () => {
    try {
      const savedWordsString = await AsyncStorage.getItem("savedWords");
      if (savedWordsString) {
        const savedWords = JSON.parse(savedWordsString).reverse();
        setSavedWords(savedWords);
      }
    } catch (error) {
      console.error("Error fetching saved words:", error);
    }
  };

  
  useEffect(async () => {
    fetchSavedWords();
    console.log("savedWords", savedWords);
  }, []);
  */

  if (!latestWord) return null;

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center w-full p-5">
      <Text className="text-slate-500 text-lg font-bold pb-3">Result</Text>
      <View className="flex flex-col items-center justify-between w-full p-5 rounded-xl border border-slate-600">
        <Text className="font-bold text-white text-3xl">
          {latestWord.danish}
        </Text>
        <Text className="text-blue-500 text-2xl font-bold mt-1">
          {latestWord.english}
        </Text>
      </View>
      {/** render past words */}
      {/*
      <View className="relative flex flex-row justify-center items-center w-full">
        <Text className="text-slate-500 text-lg font-bold mt-5">Past Word</Text>
      </View>

      <View className="flex flex-col justify-center items-center p-3 mr-5 mb-2 w-full m-0 opacity-70">
        <Text className="text-white font-bold text-xl">Kvinde</Text>
        <Text className="text-white text-base">Woman</Text>
      </View>
      */}
    </SafeAreaView>
  );
};

export default PastWords;

const styles = StyleSheet.create({});
