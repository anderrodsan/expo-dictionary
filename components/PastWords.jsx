import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import EditWord from "./EditWord";
import SpeechComponent from "./Speech";
import { removeWord } from "../data/actions";

const PastWords = ({ latestWord, setLatestWord }) => {
  if (!latestWord) return null;

  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="flex flex-col items-center w-full p-5 mb-10">
      <Text className="text-slate-500 text-lg font-bold pb-3">Result</Text>
      <View className="flex flex-col items-center justify-between w-full py-3 px-10 rounded-xl bg-slate-700/30">
        <Text className="font-bold text-white text-center text-2xl">
          {latestWord.lang1}
        </Text>

        <Text className="text-blue-500 text-xl text-center font-bold mt-1 pb-7">
          {latestWord.lang2}
        </Text>

        <View className="absolute bottom-3 right-3 flex-row space-x-2 items-center">
          <SpeechComponent
            text={latestWord.lang1}
            lang={latestWord.lang}
            size={24}
            autoplay={true}
          />
          {/**Edit button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setVisible(true)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#94a3b8" />
          </TouchableOpacity>
          {/** Save button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              console.log("removeWord", latestWord);
              removeWord({ word: latestWord }).then(() => {
                setLatestWord(null);
              });
            }}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#94a3b8"
            />
          </TouchableOpacity>
        </View>
      </View>
      <EditWord word={latestWord} visible={visible} setVisible={setVisible} />
    </SafeAreaView>
  );
};

export default PastWords;

const styles = StyleSheet.create({});
