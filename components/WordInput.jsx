import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { saveWord } from "../data/actions";

const WordInput = ({ setLatestWord }) => {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Reference to the input field

  const handleInputChange = (input) => {
    setText(input);
  };

  const handleTagChange = (input) => {
    setTag(input);
  };

  const handleSubmit = () => {
    if (text) {
      setLoading(true);
      saveWord({ text, setText, tag, setLatestWord, inputRef, language });
      Keyboard.dismiss();
      setLoading(false);
    }
  };

  //if language is false == danish -> english | true == english -> danish
  const [language, setLanguage] = useState(false);

  return (
    <View className="flex-1 flex-col w-full justify-center items-center gap-5 pt-10 pb-5 ">
      {/* Language Selector */}
      <View className="flex flex-row items-center gap-2 mb-5">
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
          tag && "border border-slate-500 "
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
        className="text-white text-4xl text-center rounded-xl w-[70%] border border-slate-500 bg-slate-700 px-5 py-5"
        ref={inputRef} // Assign the ref to the input field
        onChangeText={handleInputChange}
        value={text}
        placeholder={language ? "Type a Word..." : "Skriv et Ord..."}
        placeholderTextColor="#64748b"
        onSubmitEditing={() => handleSubmit()}
      />
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => handleSubmit()}
        className="bg-blue-500 px-5 py-1 rounded-xl flex flex-row items-center"
      >
        <MaterialCommunityIcons name="translate" size={22} color="white" />
        <Text className="text-white text-base ml-2">
          {loading ? "Saving..." : "New"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WordInput;

const styles = StyleSheet.create({});
