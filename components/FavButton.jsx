import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function FavButton({ word, handleFavorite }) {
  //Animation

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  function animateIn() {
    opacity.value = 0;
    scale.value = 0;
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 5, stiffness: 100 });
  }

  function animateOut() {
    opacity.value = 1;
    scale.value = 1;
    opacity.value = withTiming(0, { duration: 600 });
    scale.value = withSpring(0, { damping: 5, stiffness: 100 });
  }

  useEffect(() => {
    if (word.fav) {
      animateIn();
    }
  }, [word]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => {
          handleFavorite(word);
          animateOut();
        }}
        className="mr-1"
      >
        <MaterialCommunityIcons name="cards-heart" size={24} color="#3b82f6" />
      </TouchableOpacity>
    </Animated.View>
  );
}
