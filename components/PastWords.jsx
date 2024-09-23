import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import EditWord from "./EditWord";
import SpeechComponent from "./Speech";
import { removeWord, updateWord } from "../data/actions";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PastWords = ({ latestWord, setLatestWord }) => {
  if (!latestWord) return null;

  const [visible, setVisible] = useState(false);
  const opacity = useSharedValue(0);
  const position = useSharedValue(50);

  //Animation
  useEffect(() => {
    opacity.value = 0;
    position.value = 50;
    opacity.value = withTiming(1, { duration: 600 });
    position.value = withTiming(0, { duration: 300 });
  }, [latestWord]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: position.value }],
    };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className="relative flex flex-col items-center w-full p-5 mb-10"
    >
      <Text className="text-slate-500 text-lg font-bold pb-3">Result</Text>
      <View className="flex flex-col items-center justify-between w-full py-3 px-10 rounded-xl bg-slate-700/30">
        <Text className="font-bold text-white text-center text-2xl">
          {latestWord.lang1}
        </Text>

        <Text className="text-blue-500 text-xl text-center font-bold mt-1 pb-7">
          {latestWord.lang2}
        </Text>

        <Options
          latestWord={latestWord}
          setLatestWord={setLatestWord}
          setVisible={setVisible}
        />
      </View>

      <EditWord word={latestWord} visible={visible} setVisible={setVisible} />
    </Animated.View>
  );
};

export default PastWords;

function Tag({ tag }) {
  return (
    <View className="flex-1 flex-row justify-start">
      <View
        className={"flex-row items-center space-x-2 rounded-full opacity-70"}
      >
        {tag && (
          <>
            <Ionicons name="pricetag" size={16} color="#94a3b8" />
            <Text className="text-slate-300 text-sm">{tag.slice(0, 20)}</Text>
          </>
        )}
      </View>
    </View>
  );
}

function Options({ latestWord, setLatestWord, setVisible }) {
  function handleFavorite({ word }) {
    // Create a new word object with the updated favorite status
    const updatedWord = { ...word, fav: !word.fav };
    setLatestWord(updatedWord);
    console.log("updatedWord", updatedWord);
    updateWord({ word: updatedWord });
  }

  return (
    <View className="absolute bottom-3 right-5 left-5 flex-row justify-between items-center gap-1">
      <Tag tag={latestWord?.tag} />
      <SpeechComponent
        text={latestWord.lang1}
        lang={latestWord.lang}
        size={24}
        autoplay={true}
      />
      {/**Edit button */}
      <TouchableOpacity activeOpacity={0.75} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="pencil" size={20} color="#94a3b8" />
      </TouchableOpacity>

      {/**Favorite button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          console.log("handleFavorite", latestWord);
          handleFavorite({ word: latestWord });
        }}
      >
        <MaterialCommunityIcons
          name={latestWord?.fav ? "cards-heart" : "cards-heart-outline"}
          size={20}
          color={latestWord?.fav ? "#3b82f6" : "#94a3b8"}
        />
      </TouchableOpacity>

      {/** Delete button */}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          console.log("removeWord", latestWord);
          removeWord({ word: latestWord }).then(() => {
            setLatestWord(null);
          });
        }}
      >
        <MaterialCommunityIcons
          name="delete-outline"
          size={20}
          color="#94a3b8"
        />
      </TouchableOpacity>
    </View>
  );
}
