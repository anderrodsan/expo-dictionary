import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const TopHeader = () => {
  return (
    <View className="relative flex flex-row items-center justify-center gap-3 w-full p-5 mb-10">
      <View className="absolute top-6 left-3 opacity-20">
        {/** Back to index */}
        <Link href={"/"}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Link>
      </View>

      <FontAwesome6 name="book" size={20} color="#cbd5e1" />
      <Text className="text-slate-300 font-bold text-2xl">
        Word
        <Text className="text-blue-500">Wise</Text>
      </Text>
    </View>
  );
};

export default TopHeader;

const styles = StyleSheet.create({});
