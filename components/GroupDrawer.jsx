import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  BackHandler,
  Keyboard,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import EditWord from "./EditWord";
import { useFocusEffect } from "expo-router";
import Drawer from "./Drawer";
import { updateWord } from "../data/actions";
import SpeechComponent from "./Speech";

export default function GroupDrawer({ show, setShow }) {
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
      <View className="p-5 flex justify-center items-center w-full">
        <Text className="text-white text-xl font-bold text-start w-full opacity-90">
          New Group
        </Text>
        <View className="w-full flex justify-center items-center space-y-3 bg-slate-600/50 p-5 rounded-xl mt-5">
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              //open keyboard to select icons
              Keyboard
            }}
            className="flex justify-center items-center w-full"
          >
            <Text className="text-3xl text-center">🍎</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Group Name"
            placeholderTextColor={"#94a3b8"}
            className="text-white text-xl font-bold text-center w-full opacity-90 px-5 py-2 rounded-xl border border-slate-500"
          />
        </View>
        {/** Next button */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setShow(false)}
          className="bg-blue-500 rounded-xl px-3 py-2 mt-5"
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </Drawer>
  );
}
