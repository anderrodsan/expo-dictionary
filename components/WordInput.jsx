import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { fetchSavedWords, saveWord } from "../data/actions";
import LanguageSelector from "./LanguageSelector";
import { findLanguage, languageOptions } from "../data/languageOptions";
import SavedLangSelector from "./SavedLangSelector";
import { useLanguageList } from "../lib/store/store";

const WordInput = ({ setLatestWord, savedWords, lang1, setLang1 }) => {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Reference to the input field
  const [filteredWords, setFilteredWords] = useState([]);

  //if swap is false (example) == danish -> english | true == english -> danish
  const [swap, setSwap] = useState(false);

  //show the modal to pick the language1 and language2
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  //secondary language
  const [lang2, setLang2] = useState("en");

  //language list global state from store
  const { langList, setLangList } = useLanguageList();

  const handleInputChange = (input) => {
    setText(input);
    // Filter the saved words that include the input text

    if (input && savedWords) {
      const lowerCaseInput = input.toLowerCase();
      //console.log("saved: ", savedWords);
      const filteredWords = savedWords.filter(
        (word) =>
          word?.lang1 &&
          typeof word?.lang1 === "string" &&
          word?.lang1.toLowerCase().includes(lowerCaseInput) &&
          word.lang === lang1
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
      saveWord({ text, tag, lang1, lang2, swap }).then((newWord) => {
        // Remove focus from the input field
        setLatestWord(newWord);
        setText("");
        inputRef.current.blur();
        setLoading(false);
      });
      Keyboard.dismiss();
      setFilteredWords([]);
    }
  };

  return (
    <View className="flex-col w-full justify-start items-center pb-5 pt-5">
      {/* Language Selector */}
      <View className="absolute -top-7">
        <SavedLangSelector
          openDrawer={show}
          setOpenDrawer={setShow}
          lang={lang1}
          setLang={setLang1}
          langList={langList}
        />
      </View>

      {/** Language Selector 2 and swap */}

      <LanguageSwitcher
        swap={swap}
        setSwap={setSwap}
        lang1={lang1}
        setLang1={setLang1}
        lang2={lang2}
        setLang2={setLang2}
        setShow={setShow}
        setShow2={setShow2}
      />

      {/** Language selector modals*/}
      <View className="absolute inset-0">
        <LanguageSelector
          show={show}
          setShow={setShow}
          lang={lang1}
          setLang={setLang1}
          handleLanguageChange={() => {}}
        />

        <LanguageSelector
          show={show2}
          setShow={setShow2}
          lang={lang2}
          setLang={setLang2}
          handleLanguageChange={() => {}}
        />
      </View>

      {/* Tag Input */}
      <TagInput
        tag={tag}
        handleTagChange={handleTagChange}
        inputRef={inputRef}
      />

      {/* Text Input Field */}
      <TextInput
        className="text-white text-3xl text-center rounded-xl max-w-[90%] border border-slate-700/80 bg-slate-800 px-5 py-5 mt-4"
        ref={inputRef} // Assign the ref to the input field
        onChangeText={handleInputChange}
        value={text}
        placeholder={
          swap ? findLanguage(lang2)?.text : findLanguage(lang1)?.text
        }
        placeholderTextColor="#64748b"
        onSubmitEditing={() => handleSubmit()}
      />

      {/** Display the first 3 filtered words */}
      <SuggestedWords filteredWords={filteredWords} />

      {/** Submit Button */}
      <SubmitWord loading={loading} handleSubmit={handleSubmit} />
    </View>
  );
};

export default WordInput;

//language selector 2 and swap
function LanguageSwitcher({
  swap,
  setSwap,
  lang1,
  setLang1,
  lang2,
  setLang2,
  setShow,
  setShow2,
  ...props
}) {
  return (
    <View className="relative flex-row items-center justify-center px-5 pb-5">
      <View className="w-1/2 items-end px-5">
        <Pressable
          onPress={() => {
            setShow(true);
          }}
          className={`rounded-2xl text-sm min-w-[80px] py-1 px-3 ${
            swap ? "bg-slate-700" : "bg-blue-500/50"
          }`}
        >
          <Text className="text-white text-center">
            {swap ? findLanguage(lang2)?.name : findLanguage(lang1)?.name}
          </Text>
        </Pressable>
      </View>

      {/** Swap language button */}
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => setSwap(!swap)}
        className="absolute inset-0 top-1"
      >
        <Ionicons name="repeat-sharp" size={20} color="white" />
      </TouchableOpacity>
      <View className="w-1/2 items-start px-5">
        <Pressable
          onPress={() => setShow2(true)}
          className={`rounded-2xl text-sm min-w-[80px] py-1 px-3 ${
            swap ? "bg-blue-500/50" : "bg-slate-700"
          }`}
        >
          <Text className="text-white text-center">
            {swap ? findLanguage(lang1)?.name : findLanguage(lang2)?.name}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function TagInput({ handleTagChange, tag, inputRef }) {
  return (
    <View
      className={`flex flex-row items-center space-x-2 rounded-full px-3  ${
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
  );
}

//Display the first 3 filtered words
function SuggestedWords({ filteredWords }) {
  return (
    <View className="flex flex-row items-center justify-center space-x-2">
      {filteredWords?.slice(0, 3).map((word) => (
        <TouchableOpacity
          key={word?.lang1}
          title="difficulty"
          activeOpacity={0.75}
          onPress={() => {
            setText(word?.lang1);
            setFilteredWords(null);
          }}
          className="flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-600 opacity-60 mt-3"
        >
          <Text className="text-white text-xs">{word?.lang1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function SubmitWord({ handleSubmit, loading }) {
  return (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => handleSubmit()}
      className="bg-blue-500 px-5 py-1 rounded-xl mt-5"
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <View className="flex flex-row items-center space-x-1">
          <MaterialCommunityIcons name="translate" size={18} color="white" />
          <Text className="text-white text-sm ml-2">Translate</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
