import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";

const TopHeader = () => {
  return (
    <View className="flex flex-row items-center justify-center gap-3 w-full p-10">
      <FontAwesome6 name="book" size={30} color="#cbd5e1" />
      <Text className="text-slate-300 font-bold text-3xl">
        Word
        <Text className="text-blue-500">Wise</Text>
      </Text>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({});
