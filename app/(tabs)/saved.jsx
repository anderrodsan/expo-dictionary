import {
  ActivityIndicator,
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
import HeaderSearch from "../../components/HeaderSearch";

export default function Saved() {
  const [savedWords, setSavedWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("All");

  //hide all the translations
  const [hide, setHide] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [category]);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
      if (category === "All") {
        setFilteredWords(savedWords);
      } else {
        if (category === "fav") {
          const filteredWords = savedWords.filter((item) => item.fav === true);
          setFilteredWords(filteredWords);
        } else {
          //filter the words that have the status == filteredStatus and avoid repeating the last word
          const filteredWords = savedWords.filter(
            (item) => item.status === category
          );
          setFilteredWords(filteredWords);
        }
      }
      setRefreshing(false);
    });
  };

  return (
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-start items-center">
      <HeaderSearch
        title="Saved"
        data={savedWords}
        setData={setFilteredWords}
        hide={hide}
        setHide={setHide}
        filteredData={filteredWords}
      />
      {/** Add Tag Filter */}
      <SavedCategory
        category={category}
        setCategory={setCategory}
        savedWords={savedWords}
      />
      {/** Word List */}
      <View className="w-full pl-5 pb-[120px] pt-2">
        {refreshing ? (
          <View className="flex h-full justify-center items-center">
            <ActivityIndicator size="big" color="#94a3b8" />
          </View>
        ) : (
          <FlatList
            data={filteredWords}
            keyExtractor={(item) => item.danish}
            className="pb-10"
            renderItem={({ item, index }) => (
              <WordItem
                savedWords={filteredWords || savedWords}
                handleRefresh={handleRefresh}
                item={item}
                hide={hide}
                index={index}
              />
            )}
            ListEmptyComponent={
              <Link
                href={"(tabs)/home"}
                className="mr-5 bg-slate-700 rounded-xl p-5 flex justify-center items-center text-slate-300 font-bold"
              >
                Start Saving Words
              </Link>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
