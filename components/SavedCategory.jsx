import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SavedCategory({ category, setCategory, savedWords }) {
  const options = [
    {
      name: "All",
      value: "All",
      color: "slate-500",
      icon: "format-list-bulleted",
    },
    {
      name: "Liked",
      value: "fav",
      color: "slate-500",
      icon: "cards-heart-outline",
    },
    {
      name: "New",
      value: "new",
      color: "blue-500",
      icon: "plus-circle-outline",
    },
    {
      name: "Easy",
      value: "Easy",
      color: "slate-500",
      icon: "bookmark-check-outline",
    },
    {
      name: "Medium",
      value: "Medium",
      color: "orange-500",
      icon: "head-question-outline",
    },
    {
      name: "Hard",
      value: "Hard",
      color: "blue-700",
      icon: "bookmark-remove-outline",
    },
  ];

  if (!savedWords) {
    return null;
  }

  return (
    <View className="w-full py-4 border-b border-slate-700">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={options}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => setCategory(item.value)}
            className={`${
              item.value === category
                ? `bg-blue-500 border border-slate-700`
                : "border border-slate-700"
            } 
              ${index === 0 && "ml-5"}
              ${index === options.length - 1 && "mr-5"}
              rounded-full mr-2`}
          >
            <View className="flex-row px-2 py-1 items-center">
              <MaterialCommunityIcons
                name={item.icon}
                size={16}
                color="white"
              />
              <Text className="text-white ml-2">{item.name}</Text>
              <Text
                className={`text-white text-xs ml-2 rounded-full bg-slate-600 px-2`}
              >
                {item.value === "All"
                  ? savedWords.length
                  : item.value === "fav"
                  ? savedWords.filter((word) => word.fav).length
                  : savedWords.filter((word) => word.status === item.value)
                      .length}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
