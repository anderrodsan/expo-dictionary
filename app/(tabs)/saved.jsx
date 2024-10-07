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
  SlideInDown,
  SlideOutDown,
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

    //fetch saved words
    const savedWords = await fetchSavedWords();

    //filter the words that include word.lang === lang
    const filteredByLang = savedWords.filter((item) => item.lang === lang);

    //sort the words alphabetically
    const sortedWords = sort
      ? filteredByLang.sort((a, b) => a.lang1.localeCompare(b.lang1, lang))
      : filteredByLang;

    //sort by category
    const finalFilteredWords =
      category === "All"
        ? sortedWords
        : category === "fav"
        ? sortedWords.filter((item) => item.fav === true)
        : sortedWords.filter((item) => item.status === category);

    //update the states
    setSavedWords(savedWords);
    setFilteredWords(finalFilteredWords);
    setLangList(getLanguageList(savedWords)); // Set language list after filtering
    setRefreshing(false);
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
        viewableItems={viewableItems}
        /*multiSelect={multiSelect}
        setMultiSelect={setMultiSelect}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        */
      />
    ),
    [filteredWords, hide, lang]
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

  ///viewable items for enter animation
  const viewableItems = useSharedValue([]);

  return (
    <View className="bg-slate-800 flex-1 flex-col justify-start items-center">
      <HeaderSearch
        data={savedWords}
        filteredData={filteredWords}
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
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            className="absolute bottom-32 left-0 w-full flex-row justify-center z-40"
          >
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
          </Animated.View>
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
            windowSize={20}
            className="pb-10 pl-5"
            getItemCount={() => filteredWords?.length || 0}
            getItem={(_, index) => filteredWords?.[index]}
            renderItem={renderItem}
            onViewableItemsChanged={({ viewableItems: vItems }) => {
              viewableItems.value = vItems;
              //console.log("viewableItems", viewableItems.value[0].item);
            }}
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
