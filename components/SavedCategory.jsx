import { FlatList, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  SharedTransition,
  ZoomIn,
} from "react-native-reanimated";

export default function SavedCategory({ category, setCategory, savedWords }) {
  const options = [
    {
      name: "All",
      value: "All",
      color: "slate-500",
      icon: "format-list-bulleted",
    },
    {
      name: "New",
      value: "new",
      color: "blue-500",
      icon: "plus-circle-outline",
    },
    {
      name: "Liked",
      value: "fav",
      color: "slate-500",
      icon: "cards-heart-outline",
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

  const ref = React.useRef();

  if (!savedWords) {
    return null;
  }

  return (
    <View className="w-full">
      <FlatList
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={options}
        renderItem={({ item, index }) => {
          //calculate item length
          const count =
            item.value === "All"
              ? savedWords.length
              : item.value === "fav"
              ? savedWords.filter((word) => word.fav).length
              : savedWords.filter((word) => word.status === item.value).length;

          if (count === 0) {
            return null;
          }
          return (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                setCategory(item.value);
                //scroll to index with pl-5 offset
                ref.current.scrollToIndex({
                  index: index,
                  animated: true,
                });
              }}
              className={`relative border border-slate-700 bg-slate-800
              
              ${index === options.length - 1 ? "mr-5 ml-2" : "ml-2"}
              ${index === 0 && "ml-5"}
              rounded-full`}
            >
              {category === item.value && (
                <Animated.View
                  entering={ZoomIn.springify().damping(15).stiffness(200)}
                  className="absolute inset-0 h-full w-full rounded-full bg-blue-500"
                />
              )}

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
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
