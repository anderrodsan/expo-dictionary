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
import EditWord from "./EditWord";

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

  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center w-full p-5">
      <Text className="text-slate-500 text-lg font-bold pb-3">Result</Text>
      <View className="flex flex-col items-center justify-between w-full p-5 rounded-xl border border-slate-600">
        <Text className="font-bold text-white text-2xl">
          {latestWord.danish}
        </Text>
        <Text className="text-blue-500 text-xl font-bold mt-1">
          {latestWord.english}
        </Text>
        {/** Open the edit drawer */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setVisible(true)}
          className="absolute top-3 right-3 opacity-70"
        >
          <Ionicons name="create-outline" size={20} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
      <EditWord word={latestWord} visible={visible} setVisible={setVisible} />
    </SafeAreaView>
  );
};

export default PastWords;

const styles = StyleSheet.create({});
