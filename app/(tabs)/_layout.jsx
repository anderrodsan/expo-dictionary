import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

// The component is used to render the tabs in the app.
const TabIcon = ({ icon, size, name, focused }) => {
  return (
    <View className="flex-1 items-center justify-center space-y-1 pt-3">
      {focused ? (
        <Animated.View>
          <MaterialCommunityIcons
            name={icon}
            size={size}
            stro
            color={`#3b82f6`}
          />
        </Animated.View>
      ) : (
        <MaterialCommunityIcons name={icon} size={size} stro color={`gray`} />
      )}

      <Text
        className={`text-white ${
          focused ? "font-bold text-blue-500" : "text-white"
        }} ${name === "Saved" && "pt-[3px]"}`}
      >
        {name}
      </Text>
    </View>
  );
};
const TabsLayout = () => {
  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0f172a",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 70,
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={"home"}
                size={30}
                name={"Home"}
                focused={focused}
                color={"blue"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={"bookmark-multiple"}
                size={24}
                name={"Saved"}
                focused={focused}
                color={"blue"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="flashcards"
          options={{
            title: "Flashcards",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={"cards"}
                size={30}
                name={"Cards"}
                focused={focused}
                color={"blue"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={"account"}
                size={30}
                name={"Profile"}
                focused={focused}
                color={"blue"}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
