import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import WordItem from "../../components/WordItem";
import {
  clearAllData,
  fetchSavedWords,
  getLanguageList,
} from "../../data/actions";
import { Link, router } from "expo-router";
import SavedCategory from "../../components/SavedCategory";
import HeaderSearch from "../../components/HeaderSearch";
import { useLang, useLanguageList } from "../../lib/store/store";

export default function Saved() {
  const [savedWords, setSavedWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState("All");
  const [loadingMore = false, setLoadingMore] = useState(true);

  //zuztand global state for languages
  const { langList, setLangList } = useLanguageList();
  const { lang, setLang } = useLang();

  //hide all the translations
  const [hide, setHide] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [category, lang]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadingMore(true);

    //fetch saved words from async storage
    fetchSavedWords().then((savedWords) => {
      //each item on the list has the lang: "da" || "en" || ... value pair, detect which different languages exist on the list
      setLangList(getLanguageList(savedWords));
      //console.log("languages", languages);

      //filter the words that include word.lang === lang
      const filteredByLang = savedWords?.filter((item) => item.lang === lang);
      setSavedWords(filteredByLang);

      if (category === "All") {
        setFilteredWords(filteredByLang);
      } else {
        if (category === "fav") {
          //filter the words that have the fav == true
          const filteredWords = filteredByLang?.filter(
            (item) => item.fav === true
          );
          setFilteredWords(filteredWords);
        } else {
          //filter the words that have the status == filteredStatus and avoid repeating the last word
          const filteredWords = filteredByLang?.filter(
            (item) => item.status === category
          );
          setFilteredWords(filteredWords);
        }
      }
      setRefreshing(false);
    });
  };

  // Memoized renderItem function
  const renderItem = useCallback(
    ({ item, index }) => (
      <WordItem
        savedWords={filteredWords || savedWords}
        handleRefresh={handleRefresh}
        item={item}
        hide={hide}
        index={index}
        lang={lang}
      />
    ),
    [filteredWords, hide, lang]
  );

  return (
    <View className="bg-slate-800 flex-1 flex-col justify-start items-center">
      <HeaderSearch
        data={savedWords}
        setData={setFilteredWords}
        hide={hide}
        setHide={setHide}
        langList={langList}
        lang={lang}
        setLang={setLang}
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
          <View className="flex h-full w-full pr-5 justify-center items-center opacity-50">
            <ActivityIndicator size={30} color="#3b82f6" />
          </View>
        ) : (
          <FlatList
            data={filteredWords}
            keyExtractor={(item) => item?.lang1}
            className="pb-10"
            renderItem={renderItem}
            ListEmptyComponent={
              <Pressable
                onPress={() => router.push("(tabs)/home")}
                className="mr-5 bg-slate-700 rounded-xl p-5 flex justify-center items-center text-slate-300 font-bold"
              >
                <Text className="text-xl text-white">Start Saving Words</Text>
              </Pressable>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={() => setLoadingMore(false)}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={{ paddingVertical: 40, paddingLeft: 5 }}>
                  <ActivityIndicator size={20} color="#94a3b8" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
}
