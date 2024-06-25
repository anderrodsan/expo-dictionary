import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WordInput from "../../components/WordInput";
import PastWords from "../../components/PastWords";
import TopHeader from "../../components/TopHeader";
import { useLang, useLanguageList, useStore } from "../../lib/store/store";
import { fetchSavedWords, getLanguageList } from "../../data/actions";

const Home = () => {
  const [wordList, setWordList] = useState([]);
  const [latestWord, setLatestWord] = useState("");

  //zuztand global state for languages
  const { lang, setLang } = useLang();

  useEffect(() => {
    //fetch saved words at the begining
    fetchSavedWords().then((savedWords) => {
      setWordList(savedWords);
    });
  }, [latestWord]);

  return (
    <ScrollView className="flex-1 bg-slate-800">
      <View className="bg-slate-800 flex-1 flex-col justify-start items-center w-full">
        <TopHeader />
        <WordInput
          setLatestWord={setLatestWord}
          savedWords={wordList}
          lang1={lang}
          setLang1={setLang}
        />
        <PastWords latestWord={latestWord} setLatestWord={setLatestWord} />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
