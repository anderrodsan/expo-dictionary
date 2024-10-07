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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  //Animations

  const rotate = useSharedValue(0);
  const handleSwap = () => {
    //if swap rotate to one side and if not swap rotate to other side
    if (swap) {
      rotate.value = withTiming(rotate.value - 180, { duration: 300 });
    } else {
      rotate.value = withTiming(rotate.value + 180, { duration: 300 });
    }
    setSwap(!swap);
  };

  const flipAnimation = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotate.value}deg` }],
  }));

  const contentAnimation = useAnimatedStyle(() => ({
    transform: [{ rotateY: `-${rotate.value}deg` }],
  }));

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
        handleSwap={handleSwap}
        lang1={lang1}
        setLang1={setLang1}
        lang2={lang2}
        setLang2={setLang2}
        setShow={setShow}
        setShow2={setShow2}
        flipAnimation={flipAnimation}
        contentAnimation={contentAnimation}
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
      <Animated.View
        style={flipAnimation}
        className="rounded-xl max-w-[90%] border border-slate-700/80 bg-slate-800 px-5 py-5 mt-4"
      >
        <Animated.View style={contentAnimation}>
          <TextInput
            className="text-white text-3xl text-center"
            ref={inputRef} // Assign the ref to the input field
            onChangeText={handleInputChange}
            value={text}
            placeholder={
              swap ? findLanguage(lang2)?.text : findLanguage(lang1)?.text
            }
            placeholderTextColor="#64748b"
            onSubmitEditing={() => handleSubmit()}
          />
        </Animated.View>
      </Animated.View>

      {/** Display the first 3 filtered words */}
      <SuggestedWords
        filteredWords={filteredWords}
        setFilteredWords={setFilteredWords}
        setText={setText}
        setLatestWord={setLatestWord}
      />

      {/** Submit Button */}
      <SubmitWord text={text} loading={loading} handleSubmit={handleSubmit} />
    </View>
  );
};

export default WordInput;

//language selector 2 and swap
function LanguageSwitcher({
  handleSwap,
  lang1,
  setLang1,
  lang2,
  setLang2,
  setShow,
  setShow2,
  flipAnimation,
  contentAnimation,
  ...props
}) {
  return (
    <Animated.View
      style={flipAnimation}
      className="relative flex-row items-center justify-center px-5 pb-5"
    >
      <View className="w-1/2 items-end px-5">
        <Pressable
          onPress={() => {
            setShow(true);
          }}
          className={`rounded-2xl text-sm min-w-[80px] py-1 px-3 bg-blue-500/50`}
        >
          <Animated.Text
            style={contentAnimation}
            className="text-white text-center"
          >
            {findLanguage(lang1)?.name}
          </Animated.Text>
        </Pressable>
      </View>

      {/** Swap language button */}
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        onPress={() => handleSwap()}
        className="absolute inset-0 top-1"
      >
        <Ionicons name="repeat-sharp" size={20} color="white" />
      </TouchableOpacity>

      <View className="w-1/2 items-start px-5">
        <Pressable
          onPress={() => setShow2(true)}
          className={`rounded-2xl text-sm min-w-[80px] py-1 px-3 bg-slate-700
          }`}
        >
          <Animated.Text
            style={contentAnimation}
            className="text-white text-center"
          >
            {findLanguage(lang2)?.name}
          </Animated.Text>
        </Pressable>
      </View>
    </Animated.View>
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
function SuggestedWords({
  filteredWords,
  setFilteredWords,
  setLatestWord,
  setText,
}) {
  //Animation with reanimated (push the submit button down and )
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  if (filteredWords?.length > 0) {
    height.value = withTiming(40, { duration: 300 });
    opacity.value = withTiming(1, { duration: 420 });
  } else {
    height.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
  }

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="flex flex-row items-center justify-center space-x-2"
    >
      {filteredWords?.length > 0 &&
        filteredWords?.slice(0, 3).map((word) => (
          <TouchableOpacity
            key={word?.lang1}
            title="difficulty"
            activeOpacity={0.75}
            onPress={() => {
              setLatestWord(word);
              setText(null);
              setFilteredWords(null);
            }}
            className="flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-600 opacity-60 mt-3"
          >
            <Text className="text-white text-xs">{word?.lang1}</Text>
          </TouchableOpacity>
        ))}
    </Animated.View>
  );
}

function SubmitWord({ text, handleSubmit, loading }) {
  return (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => handleSubmit()}
      className={`px-5 py-1 rounded-xl mt-5 transition ease-in-out duration-1000 ${
        text ? "bg-blue-500" : "bg-blue-500/50"
      }`}
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
