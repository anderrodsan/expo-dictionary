import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// The component is used to render the tabs in the app.
const TabIcon = ({ icon, size, name, focused }) => {
  return (
    <View className="flex-1 items-center justify-center gap-1">
      <MaterialCommunityIcons
        name={icon}
        size={size}
        stro
        color={`${focused ? "#3b82f6" : "gray"}`}
      />
      <Text
        className={`text-white ${
          focused ? "font-bold text-blue-500" : "text-white"
        }}`}
      >
        {name}
      </Text>
    </View>
  );
};
const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#0f172a",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 120,
          },
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
                name={"Flashcards"}
                focused={focused}
                color={"blue"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({});
