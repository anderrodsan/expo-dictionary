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

export default function OptionsDrawer({
  word,
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
    <Modal visible={show} transparent animationType="slide">
      <View className="flex-col flex-1 justify-end rounded-xl">
        {/** Close drawer on clicking outside */}
        <Pressable onPress={() => setShow(false)} className="flex-1 w-full" />
        <View className="relative bg-slate-700 rounded-xl flex-col items-start p-5">
          {/** Bar on the top to show it's a drawer 
          <View className="h-1 w-1/3 rounded-full bg-slate-500 mb-2" />*/}

          {/** Close Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setShow(false);
            }}
            className="absolute top-5 right-5"
          >
            <Ionicons name="close-sharp" size={24} color="#cbd5e1" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-bold text-start opacity-90 mb-5">
            Options
          </Text>

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

          {/** Delete Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              handleRemove(word);
            }}
            className="w-full rounded-xl bg-slate-600/50 py-2 flex-row justify-start px-3 items-center space-x-2 opacity-90 mt-3 mb-5"
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="white"
            />
            <Text className="text-white text-base opacity-90">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
