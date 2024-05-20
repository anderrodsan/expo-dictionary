import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { savedWords } from "../data/savedWords";

const SelectCategory = ({
  statuses,
  filteredStatus,
  handleFilter,
  savedWords,
}) => {
  return (
    <View className="flex flex-row items-center justify-center space-x-2 w-full pb-3">
      <TouchableOpacity
        title="difficulty"
        activeOpacity={0.75}
        onPress={() => handleFilter("new")}
      >
        <Text
          className={`text-white text-xs text-center rounded-full px-3 py-1 border ${
            filteredStatus === "new"
              ? "bg-blue-500 border-blue-500"
              : " border-slate-500"
          }`}
        >
          New ({savedWords.filter((word) => word.status === "new").length})
        </Text>
      </TouchableOpacity>
      {statuses.map((status) => {
        const wordCount = savedWords.filter(
          (word) => word.status === status.name
        );

        if (status.name === "Easy") {
          return null;
        }

        return (
          <TouchableOpacity
            key={status.name}
            title="difficulty"
            activeOpacity={0.75}
            onPress={() => handleFilter(status.name)}
          >
            <Text
              className={`text-white text-xs text-center rounded-full px-3 py-1 border 
            ${
              filteredStatus === status.name
                ? status.color + " border-" + status.color
                : " border-slate-500"
            }
            `}
            >
              {status.name} ({wordCount.length})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({});
