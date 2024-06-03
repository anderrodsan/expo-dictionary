import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { fetchSavedWords, saveWord } from "../data/actions";

const WordInput = ({ setLatestWord }) => {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Reference to the input field
  const [filteredWords, setFilteredWords] = useState([]);
  const [savedWords, setSavedWords] = useState([]);

  useEffect(() => {
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
    });
  }, []);

  const handleInputChange = (input) => {
    setText(input);
    // Filter the saved words that include the input text

    if (input && savedWords) {
      const lowerCaseInput = input.toLowerCase();
      console.log("saved: ", savedWords);
      const filteredWords = savedWords.filter(
        (word) =>
          word.danish &&
          typeof word.danish === "string" &&
          word.danish.toLowerCase().includes(lowerCaseInput)
      );
      setFilteredWords(filteredWords);
    } else {
      setFilteredWords(null);
    }
  };

  const handleTagChange = (input) => {
    setTag(input);
  };

  const handleSubmit = () => {
    if (text) {
      setLoading(true);
      saveWord({ text, setText, tag, setLatestWord, inputRef, language }).then(
        setLoading(false)
      );
      Keyboard.dismiss();
    }
  };

  //if language is false == danish -> english | true == english -> danish
  const [language, setLanguage] = useState(false);

  return (
    <View className="flex-col w-full justify-center items-center gap-5 pt-10 pb-5 ">
      {/* Language Selector */}
      <View className="flex flex-row items-center gap-2">
        <Text className="text-white bg-slate-600 rounded-2xl text-sm w-[70px] text-center py-1">
          {language == false ? "Dansk" : "English"}
        </Text>
        <TouchableOpacity
          title="Submit"
          activeOpacity={0.75}
          onPress={() => setLanguage(!language)}
        >
          <Ionicons name="repeat-sharp" size={20} color="white" />
        </TouchableOpacity>

        <Text className="text-white bg-slate-700 rounded-2xl text-sm w-[70px] text-center py-1">
          {language == false ? "English" : "Dansk"}
        </Text>
      </View>

      {/* Tag Input */}
      <View
        className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1  ${
          tag ? "border border-slate-500 " : "border border-slate-800 "
        }`}
      >
        <Ionicons name="pricetag" size={16} color="#94a3b8" />
        <TextInput
          className={`text-slate-300 text-sm`}
          ref={inputRef} // Assign the ref to the input field
          onChangeText={handleTagChange}
          value={tag}
          placeholder={"Add a tag..."}
          placeholderTextColor="#94a3b8"
          //focus on the next input on enter
          onSubmitEditing={(inputRef) => inputRef.current.focus()}
        />
      </View>

      {/* Text Input Field */}
      <TextInput
        className="text-white text-3xl text-center rounded-xl w-[70%] border border-slate-500 bg-slate-800 px-5 py-5"
        ref={inputRef} // Assign the ref to the input field
        onChangeText={handleInputChange}
        value={text}
        placeholder={language ? "Type a word..." : "Skriv et ord..."}
        placeholderTextColor="#64748b"
        onSubmitEditing={() => handleSubmit()}
      />

      {/** Display the first 3 filtered words */}
      <View className="flex flex-row items-center justify-center space-x-2">
        {filteredWords?.slice(0, 3).map((word) => (
          <TouchableOpacity
            key={word.danish}
            title="difficulty"
            activeOpacity={0.75}
            onPress={() => {
              if (language) {
                setText(word.english);
              } else {
                setText(word.danish);
              }
              setFilteredWords(null);
            }}
            className="flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-600"
          >
            <Text className="text-white text-xs">
              {language == false ? word.danish : word.english}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => handleSubmit()}
        className="bg-blue-500 px-5 py-1 rounded-xl"
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View className="flex flex-row items-center space-x-2">
            <MaterialCommunityIcons name="translate" size={18} color="white" />
            <Text className="text-white text-sm ml-2">New</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default WordInput;

const styles = StyleSheet.create({});
