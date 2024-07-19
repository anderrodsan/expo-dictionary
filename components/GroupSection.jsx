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
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function GroupSection({ isHidden, group, setGroup }) {
  const [openGroupDrawer, setOpenGroupDrawer] = useState(false);

  const height = useSharedValue(90);
  const opacity = useSharedValue(1);

  //Animations for the header
  const AnimatedStyle = useAnimatedStyle(() => {
    if (isHidden) {
      height.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 100 });
    }

    if (!isHidden) {
      height.value = withTiming(90, { duration: 100 });
      opacity.value = withTiming(1, { duration: 100 });
    }

    return {
      height: height.value,
      opacity: opacity.value,
    };
  }, [isHidden]);

  //mock data to simulate word folders such as food, verbs, items, colors, etc. add icons to each
  const mockData = [
    {
      id: 1,
      name: "Food",
      icon: "🍎",
    },
    {
      id: 2,
      name: "Verbs",
      icon: "💬",
    },
    {
      id: 3,
      name: "Items",
      icon: "☂️",
    },
    {
      id: 4,
      name: "Colors",
      icon: "🎨",
    },
    {
      id: 5,
      name: "Animals",
      icon: "🐱",
    },
    {
      id: 6,
      name: "Professions",
      icon: "🎓",
    },
  ];

  const mockDataEmpty = [
    {
      id: 1,
      name: "Unknown",
      icon: "❓",
    },
  ];

  return (
    <Animated.View
      className="absolute top-2 z-40 bg-slate-800"
      style={AnimatedStyle}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-2"
      >
        <View className="ml-5" />
        {mockData?.map((item) => (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              if (group === item.name) {
                setGroup(null);
              } else {
                setGroup(item?.name);
              }
              //scroll horizontally to the selected group
            }}
            key={item?.id}
            className={`relative min-w-32 flex justify-center items-center border border-slate-700 mr-2 py-2 px-7 rounded-xl ${
              group === item.name ? "bg-blue-500/50" : "bg-slate-700/50"
            }`}
          >
            {/** X button in the top right corner to set category null */}

            <Text className={`text-xl mb-1`}>{item?.icon}</Text>
            <Text className={`text-white opacity-80`}>{item?.name}</Text>
          </TouchableOpacity>
        ))}
        {/** Create a new deck */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            setOpenGroupDrawer(true);
          }}
          className="flex justify-center items-center border border-slate-700 mr-5 py-2 px-7 rounded-xl"
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
          <Text className={`text-white opacity-80`}>Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}
