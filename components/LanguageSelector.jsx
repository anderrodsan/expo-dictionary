import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Drawer from "./Drawer";
import { languageOptions } from "../data/languageOptions";

export default function LanguageSelector({
  show,
  setShow,
  lang,
  setLang,
  handleLanguageChange,
}) {
  return (
    <Drawer show={show} setShow={setShow} className={""}>
      <Text className="text-white text-lg font-bold text-start opacity-90 mb-5 pt-5 px-5">
        Select Language
      </Text>
      <ScrollView className="h-2/3 w-full px-5">
        {languageOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.75}
            onPress={() => {
              setLang(option.value);
              handleLanguageChange();
              setShow(false);
            }}
            className={`w-full flex-row items-center justify-between p-3 my-1 rounded-lg ${
              lang === option.value ? "bg-blue-500" : "bg-slate-600/40"
            }`}
          >
            <Text className="text-white text-start opacity-90">
              {option.name}
            </Text>
            <Text className="text-white text-start opacity-50">
              {option.original}
            </Text>
          </TouchableOpacity>
        ))}
        <View className="h-5" />
      </ScrollView>
    </Drawer>
  );
}
