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

export default function Saved() {
  const [savedWords, setSavedWords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSavedWords({ setSavedWords });
    //setSavedWords([]);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    fetchSavedWords({ setSavedWords });
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-start items-center">
      {/** Header */}
      <View className="flex flex-col px-5 pt-5 w-full border-slate-700 mb-5">
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

        <Text className="text-base pl-9 pb-2 text-blue-500 font-bold">
          {savedWords.length} Words
        </Text>
      </View>

      {/** Add Tag Filter */}

      {/** Word List */}
      <View className="w-full pl-5 pb-[65px]">
        <FlatList
          data={savedWords}
          keyExtractor={(item) => item.id}
          className="pb-10"
          renderItem={({ item, index }) => (
            <WordItem
              savedWords={savedWords}
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
