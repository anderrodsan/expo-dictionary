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
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";

export default function Drawer({ show, setShow, className, children }) {
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
    <View className="flex-col flex-1">
      <Modal visible={show} transparent animationType="slide">
        <View className="flex-col flex-1 justify-end">
          {/** Close drawer on clicking outside */}
          <Pressable
            onPress={() => setShow(false)}
            className="flex-1 w-full bg-black/10 transition-ease duration-200"
          />
          <View
            className={`relative bg-slate-700 rounded-t-xl flex-col items-start ${className}`}
          >
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
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
}
