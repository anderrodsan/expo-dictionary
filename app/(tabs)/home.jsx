import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WordInput from "../../components/WordInput";
import PastWords from "../../components/PastWords";
import TopHeader from "../../components/TopHeader";

const Home = () => {
  const [latestWord, setLatestWord] = useState(null);

  return (
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-start items-center w-full">
      <TopHeader />
      <WordInput setLatestWord={setLatestWord} />
      <PastWords latestWord={latestWord} />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
