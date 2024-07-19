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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import EditWord from "./EditWord";
import { useFocusEffect } from "expo-router";
import Drawer from "./Drawer";
import { updateWord } from "../data/actions";
import SpeechComponent from "./Speech";

export default function OptionsDrawer({
  word,
  lang,
  show,
  setShow,
  handleEdit,
  handleFavorite,
  handleRemove,
}) {
  //if the back button is pressed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Handle the back button press here
        // For example, set `open` to `false`
        setShow(false);
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
    <Drawer show={show} setShow={setShow} className={""}>
      {/** Word Info */}
      <View className="px-16 pt-4 w-full flex items-center">
        <Text className="text-white text-2xl font-bold text-center opacity-90">
          {word.lang1}
        </Text>
        <Text className="text-blue-500 text-lg font-bold text-center opacity-90 pb-2">
          {word.lang2}
        </Text>
        <SpeechComponent
          text={word.lang1}
          lang={lang}
          size={24}
          autoplay={false}
        />
      </View>

      <Text className="text-white text-lg font-bold text-start opacity-80 px-5 pb-5">
        Options
      </Text>

      <View className="px-5 pb-5 w-full">
        {/** Add To Favorites Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            handleFavorite(word);
          }}
          className="w-full rounded-xl bg-slate-600/50 py-2 flex-row justify-start px-3 items-center space-x-2 opacity-90"
        >
          <MaterialCommunityIcons
            name={word.fav ? "heart-off" : "cards-heart-outline"}
            size={20}
            color="white"
          />
          <Text className="text-white text-base">
            {word?.fav ? "Remove from favorites" : "Add to favorites"}
          </Text>
        </TouchableOpacity>

        {/** Eddit Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            handleEdit();
          }}
          className="w-full rounded-xl bg-slate-600/50 py-2 flex-row justify-start px-3 items-center space-x-2 opacity-90 mt-3"
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-white text-base opacity-90">Edit</Text>
        </TouchableOpacity>

        {/** Difficulty Buttons */}
        <View className="w-full rounded-xl bg-slate-600/50 py-2 flex justify-start px-2 space-x-2 opacity-90 mt-3">
          <View className="flex flex-row items-center space-x-2 px-1">
            <MaterialCommunityIcons
              name="comment-question-outline"
              size={20}
              color="white"
            />
            <Text className="text-white text-base opacity-90">
              Set difficulty
            </Text>
          </View>
          <DifficultyButtons word={word} setShow={setShow} />
        </View>

        {/** Delete Button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => {
            handleRemove(word);
          }}
          className="w-full rounded-xl bg-red-500/50 py-2 flex-row justify-start px-3 items-center space-x-2 opacity-90 mt-3 mb-5"
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={20}
            color="white"
          />
          <Text className="text-white text-base opacity-90">Delete</Text>
        </TouchableOpacity>
      </View>
    </Drawer>
  );
}

function DifficultyButtons({ word, setShow }) {
  const statuses = [
    {
      name: "Easy",
      color: "border border-slate-500 bg-slate-500",
    },
    {
      name: "Medium",
      color: "bg-orange-600",
    },
    {
      name: "Hard",
      color: "bg-blue-700",
    },
  ];

  const handleUpdate = (status) => {
    // change the word.status with the new status value
    word.status = status;
    updateWord({ word });
    setShow(false);
  };

  return (
    <View className="flex flex-row items-center justify-center w-full pt-2 pb-1">
      {/** Difficulty Buttons */}
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.name}
          title="difficulty"
          activeOpacity={0.75}
          onPress={() => handleUpdate(status.name)}
          className={`w-1/3 px-1`}
        >
          <View
            className={`text-white text-center rounded-full w-full py-2 ${
              word.status === status.name ? status.color : "bg-slate-500/70"
            }`}
          >
            <Text className={`text-white text-center`}>{status.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
