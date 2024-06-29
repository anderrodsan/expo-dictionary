//starter rnfes
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  // Load splash screen prior to rendering the app
  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for two seconds to simulate a slow loading experience.
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <View className="flex-1 bg-slate-800" />;
  }

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="#1e293b" />
      <Stack className="flex-1 bg-slate-800 text-white">
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerTransparent: true,
            translucent: true,
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
    </>
  );
};

export default RootLayout;
