//starter rnfes

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "react-native";

const RootLayout = () => {
  return (
    <Stack className="bg-slate-800 text-white">
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          statusBarColor: "#1e293b",
          navigationBarColor: "#1e293b",
          contentStyle: {
            backgroundColor: "#1e293b", // Your main app background color here
          },
          animation: "ios",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          statusBarColor: "#1e293b",
          navigationBarColor: "#0f172a",
          contentStyle: {
            backgroundColor: "#1e293b", // Your main app background color here
          },
          animation: "ios",
        }}
      />
      <Stack.Screen
        name="json"
        options={{
          headerShown: false,
          statusBarColor: "#1e293b",
          navigationBarColor: "#1e293b",
          contentStyle: {
            backgroundColor: "#1e293b", // Your main app background color here
          },
          animation: "ios",
        }}
      />
    </Stack>
  );
};

export default RootLayout;
