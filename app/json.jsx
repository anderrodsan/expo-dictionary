import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { clearAllData, fetchSavedWords } from "../data/actions";
import * as Clipboard from "expo-clipboard";

export default function Json() {
  const [savedWords, setSavedWords] = useState([]);
  const [editedWords, setEditedWords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // fetch saved words
  useEffect(() => {
    handleRefresh();
  }, []);

  // handle clear all data
  const handleClean = async () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want o clear all the data?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => clearAllData({ setSavedWords }) },
      ]
    );
  };

  // handle refreshing
  const handleRefresh = async () => {
    setRefreshing(true);
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
    });
    setRefreshing(false);
  };

  // handle copy to clipboard
  const handleCopy = async () => {
    const json = JSON.stringify(savedWords);
    await Clipboard.setStringAsync(json);
    setCopied(true);
    // wait for 3 seconds and then set copied to false
    setTimeout(() => setCopied(false), 3000);
  };

  // handle Save changes
  const handleSave = async () => {
    // save the edited words into the
  };

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-slate-800 text-white">
      {/** Header */}
      <View className="flex flex-row px-5 py-5 w-full border-b border-slate-700 mb-5 items-center justify-start">
        <Link href={"/(tabs)/saved"}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </Link>

        <Text className="flex-1 text-white text-xl font-bold pl-3">
          WordList (JSON)
        </Text>

        {/** Button to save changes, only if teh content is changed 
        {editedWords !== savedWords && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => handleSave()}
            className="p-2 bg-blue-500 rounded-xl flex flex-row items-center space-x-2 mr-2"
          >
            <MaterialCommunityIcons
              name="content-save-check-outline"
              size={22}
              color="#cbd5e1"
            />
          </TouchableOpacity>
        )}
        */}

        {/** Button to copy the json data to clipboard */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => addFavFalse(savedWords)}
          className="p-2 bg-slate-700 rounded-xl flex flex-row items-center space-x-2 mr-2"
        >
          <MaterialCommunityIcons
            name={copied ? "clipboard-check-outline" : "clipboard-outline"}
            size={22}
            color="#cbd5e1"
          />
          {copied && <Text className="text-slate-300">Copied</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleClean()}
          className="p-2 bg-red-700 rounded-xl flex flex-row items-center space-x-2"
        >
          <MaterialCommunityIcons
            name="delete-sweep"
            size={22}
            color="#cbd5e1"
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        className="flex-1 w-full"
      >
        {/** Stringified JSON data and show it with prettier
        <Text className="text-slate-300 text-start w-full px-5">
          {JSON.stringify(savedWords, null, 2)}
        </Text> 
        */}
        {/** Stringified JSON data and show it with prettier */}
        <TextInput
          className="flex-1 text-slate-300 text-start w-full px-5"
          value={JSON.stringify(savedWords, null, 2)}
          multiline={true}
          //update the editedWords state when the text changes
          onChangeText={(text) => setEditedWords(JSON.parse(text))}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
