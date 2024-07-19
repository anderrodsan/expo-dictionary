import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Drawer from "./Drawer";
import { findLanguage } from "../data/languageOptions";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SavedLangSelector({
  openDrawer,
  setOpenDrawer,
  lang,
  setLang,
  langList,
}) {
  return (
    <View className="">
      {/** Select language button */}
      <TouchableOpacity
        onPress={() => {
          setOpenDrawer(true);
        }}
        activeOpacity={0.75}
        className="flex-row items-center justify-center space-x-1 px-2 py-1 rounded-lg bg-blue-500/50"
      >
        <Ionicons name="language" size={20} color="white" />
        {/** Capitalized language "da" -> "DA" */}
        <Text className="text-white font-bold">{lang?.toUpperCase()}</Text>
      </TouchableOpacity>

      {/** Select language drawer */}
      <Drawer className={""} show={openDrawer} setShow={setOpenDrawer}>
        <Text className="text-white text-lg font-bold text-start opacity-90 mb-5 pt-5 px-5">
          Select Language
        </Text>
        <View className="w-full px-5">
          {langList?.map((option, index) => {
            //find the language name
            const language = findLanguage(option);

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.75}
                onPress={() => {
                  setLang(option);
                  setOpenDrawer(false);
                }}
                className={`w-full flex-row items-center justify-between p-3 my-1 rounded-lg ${
                  lang === language?.value
                    ? "bg-blue-500/50"
                    : "bg-slate-600/40"
                }`}
              >
                <View className="opacity-70">
                  <Ionicons name="language" size={20} color="white" />
                </View>
                <Text className="flex-1 ml-2 text-white text-start opacity-90">
                  {language?.name}
                </Text>
                <Text className="text-white text-start opacity-50">
                  {language?.original}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="h-5" />
      </Drawer>
    </View>
  );
}
