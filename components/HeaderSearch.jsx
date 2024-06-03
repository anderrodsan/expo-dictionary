import {
  BackHandler,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useCallback } from "react";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

export default function HeaderSearch({ data, setData, hide, setHide }) {
  const [open, setOpen] = React.useState(false);

  //if the back button is pressed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Handle the back button press here
        // For example, set `open` to `false`
        setOpen(false);
        setData(data);
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
    <View className="flex w-full px-5">
      {open ? (
        <View className="flex-row justify-between items-center w-full space-x-3 pt-4">
          <Pressable
            onPress={() => {
              setOpen(false);
              setData(data);
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>

          <TextInput
            autoFocus
            className="flex-1 text-white py-1 px-5 bg-slate-700 rounded-lg text-content"
            placeholder="Search"
            placeholderTextColor={"gray"}
            onChange={(e) => {
              console.log(e.nativeEvent.text);
              //if the text is empty
              if (e.nativeEvent.text === "") return setData(data);
              const filteredData = data.filter((item) => {
                return item.danish
                  .toLowerCase()
                  .includes(e.nativeEvent.text.toLowerCase());
              });
              setData(filteredData);
              //detect if the back button is pressed close
            }}
          />
        </View>
      ) : (
        <View className="flex flex-col pt-5 pb-1 w-full border-slate-700">
          <View className="flex flex-row w-full items-center justify-start">
            <Ionicons name="bookmarks" size={22} color="white" />
            <Text className="flex-1 text-white text-xl font-bold pl-3">
              Dictionary
            </Text>
            <TouchableOpacity
              onPress={() => setHide(!hide)}
              activeOpacity={0.75}
              className={`px-2 py-1  rounded-lg mr-5 ${
                hide ? "bg-blue-500" : "bg-slate-700"
              }`}
            >
              {hide ? (
                <MaterialCommunityIcons
                  name="eye-off-outline"
                  size={20}
                  color="white"
                />
              ) : (
                <MaterialCommunityIcons
                  name="eye-outline"
                  size={20}
                  color="white"
                />
              )}
            </TouchableOpacity>

            <Pressable onPress={() => setOpen(true)}>
              <FontAwesome name="search" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
