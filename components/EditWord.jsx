import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateWord } from "../data/actions";
import { useFocusEffect } from "expo-router";

export default function EditWord({ word, visible, setVisible }) {
  const [danishWord, setDanishWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    setDanishWord(word.danish);
    setEnglishWord(word.english);
    setTag(word.tag);
  }, [word]);

  //Function to update the word
  const handleUpdate = (word) => {
    //add new value pair fav: true or false
    word.danish = danishWord;
    word.english = englishWord;
    word.tag = tag ? tag : word.tag;

    console.log("word", danishWord, englishWord, word);
    updateWord({ word }).then(() => {
      setVisible(false);
    });
  };

  //if the back button is pressed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Handle the back button press here
        // For example, set `open` to `false`
        setVisible(false);
        return true; // Return true to prevent default back button behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-col flex-1 justify-end rounded-xl">
        {/** Close drawer on clicking outside */}
        <Pressable
          onPress={() => setVisible(false)}
          className="flex-1 w-full"
        />
        <View className="relative bg-slate-700 rounded-xl flex-col items-start p-5 ">
          {/** Bar on the top to show it's a drawer 
          <View className="h-1 w-1/3 rounded-full bg-slate-500 mb-2" />*/}
          <Text className="text-white text-lg font-bold text-start opacity-90 mb-3">
            Edit Word
          </Text>

          {/** Close Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setVisible(false);
              setDanishWord(word.danish);
              setEnglishWord(word.english);
            }}
            className="absolute top-0 right-0 p-5"
          >
            <Ionicons name="close-sharp" size={24} color="#cbd5e1" />
          </TouchableOpacity>

          {/* Tag Input */}
          <View
            className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1 mb-3  ${
              tag ? "border border-slate-500 " : "border border-slate-700 "
            }`}
          >
            <Ionicons name="pricetag" size={16} color="#94a3b8" />
            <TextInput
              className={`text-slate-300 text-sm`}
              onChangeText={(text) => setTag(text)}
              value={tag}
              placeholder={"Add a tag..."}
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/** Text Inputs for danish and english words */}
          <TextInput
            value={danishWord}
            onChangeText={(input) => setDanishWord(input)}
            className="text-white text-base font-bold px-3 py-2 border border-slate-500 rounded-xl w-full mb-3"
          />

          <TextInput
            value={englishWord}
            onChangeText={(input) => setEnglishWord(input)}
            className="text-blue-500 text-base font-bold px-3 py-2 border border-slate-500 rounded-xl w-full"
          />

          {/** Update Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              handleUpdate(word);
            }}
            className="w-full my-7 bg-blue-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center">Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
