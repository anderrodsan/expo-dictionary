import {
  BackHandler,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useCallback } from "react";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import Drawer from "./Drawer";
import { findLanguage } from "../data/languageOptions";
import SavedLangSelector from "./SavedLangSelector";

export default function HeaderSearch({
  data,
  setData,
  hide,
  setHide,
  langList,
  lang,
  setLang,
  sort,
  setSort,
}) {
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  //if the back button is pressed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Handle the back button press here
        // For example, set `openSearch` to `false`
        setOpenSearch(false);
        setData(data);
        return true; // Return true to prevent default back button behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <View className="flex w-full px-5 ">
      {openSearch ? (
        <View className="flex-row justify-between items-center w-full space-x-3 pt-4">
          {/** Back Button */}
          <Pressable
            onPress={() => {
              setOpenSearch(false);
              setData(data);
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          {/** Search Bar */}
          <TextInput
            autoFocus
            className="flex-1 text-white py-1 px-5 bg-slate-700 rounded-lg text-content"
            placeholder="Search"
            placeholderTextColor={"gray"}
            onChange={(e) => {
              console.log(e.nativeEvent.text);
              //if the text is empty
              if (e.nativeEvent.text === "") return setData(data);
              const filteredData = data.filter((item) => {
                //if lang1 || lang2 || tag == text,
                return (
                  item.lang1
                    .toLowerCase()
                    .includes(e.nativeEvent.text.toLowerCase()) ||
                  item.lang2
                    .toLowerCase()
                    .includes(e.nativeEvent.text.toLowerCase()) ||
                  item.tag
                    .toLowerCase()
                    .includes(e.nativeEvent.text.toLowerCase())
                );
              });
              setData(filteredData);
              //detect if the back button is pressed close
            }}
          />
        </View>
      ) : (
        <View className="flex flex-col pt-5 pb-1 w-full border-slate-700">
          {/** Header content */}
          <View className="flex flex-row w-full items-center justify-start">
            <Ionicons name="bookmarks" size={22} color="white" />
            <Text className="flex-1 text-white text-xl font-bold pl-3">
              Dictionary
            </Text>

            {/** Hide translations button */}
            <TouchableOpacity
              onPress={() => setHide(!hide)}
              activeOpacity={0.75}
              className={`px-2 py-1 rounded-lg mr-2 ${
                hide ? "bg-blue-500/70" : "bg-slate-700"
              }`}
            >
              <MaterialCommunityIcons
                name="eye-off-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>

            {/** Hide translations button */}
            <TouchableOpacity
              onPress={() => setSort(!sort)}
              activeOpacity={0.75}
              className={`px-2 py-1 rounded-lg mr-2 ${
                sort ? "bg-blue-500/70" : "bg-slate-700"
              }`}
            >
              <MaterialCommunityIcons
                name="order-alphabetical-ascending"
                size={20}
                color="white"
              />
            </TouchableOpacity>

            {/** Select Language */}
            <View className="mr-5">
              <SavedLangSelector
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                lang={lang}
                setLang={setLang}
                langList={langList}
              />
            </View>

            <Pressable onPress={() => setOpenSearch(true)}>
              <FontAwesome name="search" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
