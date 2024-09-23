import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import GroupDrawer from "../../components/GroupDrawer";
import GroupSection from "../../components/GroupSection";

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

  //sort alphabetically
  const [sort, setSort] = useState(false);
  const [group, setGroup] = useState(null);

  //multi select the word item id's to manage them together
  const [selectedItems, setSelectedItems] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [category, lang, sort, group]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoadingMore(true);

    //fetch saved words from async storage
    fetchSavedWords().then((savedWords) => {
      //each item on the list has the lang: "da" || "en" || ... value pair, detect which different languages exist on the list
      setLangList(getLanguageList(savedWords));
      //console.log("languages", languages);

      const sortedWords = sort
        ? savedWords?.sort((a, b) => a.lang1.localeCompare(b.lang1, lang))
        : savedWords;

      //filter the words that include word.lang === lang
      const filteredByLang = sortedWords?.filter((item) => item.lang === lang);
      setSavedWords(filteredByLang);

      /*filter the words based on the group
      const filteredByGroup = group
        ? filteredByLang?.filter((item) => item.tag === group)
        : filteredByLang;
      */

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

  //when  navigation back button is pressed setMultiSelect = false

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
        sort={sort}
        /*multiSelect={multiSelect}
        setMultiSelect={setMultiSelect}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        */
      />
    ),
    [filteredWords, hide, lang, multiSelect, selectedItems]
  );

  //detect scroll down and hide the header, scroll up and show the header
  const [isHidden, setIsHidden] = useState(false);

  const onScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;

    if (scrollOffset > 50) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    //console.log(scrollOffset);
  };

  //scroll to top
  const flatListRef = React.useRef();

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
        sort={sort}
        setSort={setSort}
      />
      {/** Add Tag Filter */}
      <View className="w-full py-4 border-b border-slate-700">
        <SavedCategory
          category={category}
          setCategory={setCategory}
          savedWords={savedWords}
        />
      </View>

      {/** Word List */}
      <View className="relative w-full pb-[120px] pt-2">
        {/** Scroll to top button */}
        {filteredWords && isHidden && (
          <View className="absolute bottom-32 left-0 w-full flex-row justify-center z-40">
            <TouchableOpacity
              onPress={() =>
                flatListRef.current.scrollToOffset({
                  animated: true,
                  offset: 0,
                })
              }
              className="bg-blue-500/70 rounded-full p-2"
            >
              <MaterialCommunityIcons
                name="chevron-double-up"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        )}

        {/** Add folders in an horizontal scroll 
        <GroupSection isHidden={isHidden} group={group} setGroup={setGroup} />*/}

        {refreshing ? (
          <View className="flex h-full w-full pr-5 justify-center items-center opacity-50">
            <ActivityIndicator size={30} color="#3b82f6" />
          </View>
        ) : (
          <VirtualizedList
            ref={flatListRef}
            data={filteredWords}
            keyExtractor={(item) => item?.lang1}
            className="pb-10 pl-5"
            getItemCount={() => filteredWords?.length || 0}
            getItem={(_, index) => filteredWords?.[index]}
            renderItem={renderItem}
            ListEmptyComponent={
              <Pressable
                onPress={() => router.push("(tabs)/home")}
                className="mt-24 mr-5 bg-slate-700/50 rounded-xl p-5 flex justify-center items-center text-slate-300 font-bold"
              >
                <Text className="text-white opacity-80">No results</Text>
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
            onScroll={onScroll}
          />
        )}
      </View>
    </View>
  );
}
