import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import WordItem from "../../components/WordItem";
import { clearAllData, fetchSavedWords } from "../../data/actions";
import { Link } from "expo-router";
import SavedCategory from "../../components/SavedCategory";

export default function Saved() {
  const [savedWords, setSavedWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    handleRefresh();
    //setSavedWords([]);
  }, [category]);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchSavedWords({ setSavedWords }).then(() => {
      if (category === "All") {
        setFilteredWords(savedWords);
      } else {
        //filter the words that have the status == filteredStatus and avoid repeating the last word
        const filteredWords = savedWords.filter(
          (item) => item.status === category
        );
        setFilteredWords(filteredWords);
      }
    });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-start items-center">
      {/** Header */}
      <View className="flex flex-col px-5 pt-5 w-full border-slate-700">
        <View className="flex flex-row w-full items-center justify-start">
          <Ionicons name="bookmarks" size={22} color="white" />
          <Text className="flex-1 text-white text-xl font-bold pl-3">
            Dictionary
          </Text>
          <TouchableOpacity
            className="p-2 bg-slate-700 rounded-xl"
            activeOpacity={0.75}
          >
            <Link
              href={"/json"}
              className="flex flex-row items-center space-x-3"
            >
              <MaterialCommunityIcons
                name="code-json"
                size={20}
                color="#cbd5e1"
              />
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      {/** Add Tag Filter */}
      <SavedCategory
        category={category}
        setCategory={setCategory}
        savedWords={savedWords}
      />

      {/** Word List */}
      <View className="w-full pl-5 pb-[120px] pt-2">
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.danish}
          className="pb-10"
          renderItem={({ item, index }) => (
            <WordItem
              savedWords={filteredWords || savedWords}
              setSavedWords={setSavedWords}
              item={item}
              index={index}
            />
          )}
          ListEmptyComponent={
            <Text className="mr-5 bg-slate-700 rounded-xl p-5 flex justify-center items-center text-slate-300 font-bold">
              No Saved Words
            </Text>
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
