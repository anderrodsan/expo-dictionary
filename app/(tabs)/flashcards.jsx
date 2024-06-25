import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchNewWord,
  fetchSavedWords,
  getLanguageList,
  updateWord,
} from "../../data/actions";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import SelectCategory from "../../components/SelectCategory";
import SpeechComponent from "../../components/Speech";
import SavedLangSelector from "../../components/SavedLangSelector";
import { useLang, useLanguageList } from "../../lib/store/store";

const FlashCards = () => {
  //open the drawer and show the word
  const [openDrawer, setOpenDrawer] = useState(false);
  const [show, setShow] = useState(false);

  //loading new word
  const [loading, setLoading] = useState(false);

  //change the language
  const [swap, setSwap] = useState(false);

  //zuztand global state for languages
  const { langList, setLangList } = useLanguageList();
  const { lang, setLang } = useLang();

  //displayed word, wordlist and status filter
  const [word, setWord] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("new");

  useEffect(() => {
    //getNewWord();
  }, [filteredStatus, lang]);

  const statuses = [
    {
      name: "Easy",
      color: "border border-slate-500 bg-slate-500",
    },
    {
      name: "Medium",
      color: "bg-orange-600",
    },
    {
      name: "Hard",
      color: "bg-blue-700",
    },
  ];

  // update word difficulty
  const handleUpdate = (status) => {
    // change the word.status with the new status value
    word.status = status;
    console.log(word);

    updateWord({ word });
    getNewWord();
    setShow(false);
  };

  const handleLanguage = () => {
    setSwap(!swap);
  };

  const handleFilter = (status) => {
    setFilteredStatus(status);
    setShow(false);
    getNewWord();
  };

  //get the saved word list and choose a random new word to show
  const getNewWord = () => {
    setLoading(true);
    fetchSavedWords().then((savedWords) => {
      setLangList(getLanguageList(savedWords));
      //filter the words that include word.lang === lang
      const data = savedWords.filter((item) => item.lang === lang);

      setSavedWords(data);

      fetchNewWord({ data, filteredStatus }).then((word) => {
        setWord(word);
      });
      setShow(false);
      setLoading(false);
    });
  };

  const handleFavorite = (word) => {
    //add new value pair fav: true or false
    word.fav = word.fav ? !word.fav : true;
    updateWord({ word }).then(() => {
      getNewWord();
    });
  };

  return (
    <View className="relative bg-slate-800 flex-1 flex-col justify-center items-center w-[100dvh]">
      <View className="flex flex-row w-full items-center justify-center p-5">
        <MaterialCommunityIcons name="cards" size={24} color="white" />
        <Text className="text-white text-xl font-bold pl-3">Flashcards</Text>
      </View>

      {/** Select Language */}
      <View className="absolute top-5 right-5">
        <SavedLangSelector
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          lang={lang}
          setLang={setLang}
          langList={langList}
        />
      </View>

      {/** Category Selector */}
      <SelectCategory
        statuses={statuses}
        filteredStatus={filteredStatus}
        setFilteredStatus={setFilteredStatus}
        savedWords={savedWords}
      />

      {/** Word Card */}
      <View className="flex-1 w-full px-5 pb-5">
        <View className="relative flex-1 flex-col justify-between items-center border border-slate-700 bg-slate-700/20 rounded-3xl">
          {/** Refresh button */}
          <RefreshButton getNewWord={getNewWord} />
          {/** Language swap button */}
          <LanguageSwitcher handleLanguage={handleLanguage} />
          {/** Like button */}
          <FavButton word={word} handleFavorite={handleFavorite} />

          {/** Word Text */}
          {!word ? (
            <EmptyList />
          ) : (
            <View className="flex-1 flex flex-col justify-between items-center">
              <PrimaryWord word={word} swap={swap} lang={lang} />

              {/** Secondary word */}
              {show && !loading && (
                <Text className="text-blue-500 text-2xl text-center font-bold">
                  {swap ? word.lang1 : word.lang2}
                </Text>
              )}

              {/** Loading  */}
              {loading && (
                <View className="flex justify-center items-center">
                  <ActivityIndicator size="large" color="#3b82f6" />
                </View>
              )}

              {/** Difficulty Buttons or RevealButton */}
              {show && !loading ? (
                <DifficultyButtons
                  statuses={statuses}
                  handleUpdate={handleUpdate}
                />
              ) : (
                <TouchableOpacity
                  title="Submit"
                  activeOpacity={0.75}
                  onPress={() => setShow(!show)}
                >
                  <Text className=" text-white text-xl font-bold pb-10 opacity-30">
                    Tap to reveal
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FlashCards;

function RefreshButton({ getNewWord }) {
  return (
    <TouchableOpacity
      title="refresh"
      activeOpacity={0.75}
      onPress={() => {
        getNewWord();
      }}
      className="absolute top-5 right-5"
    >
      <Ionicons name="refresh-sharp" size={24} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

function LanguageSwitcher({ handleLanguage }) {
  return (
    <View className="pt-4">
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        className="flex-row items-center space-x-1 px-3 py-1 bg-slate-700 rounded-xl"
        onPress={() => handleLanguage()}
      >
        <Ionicons name="language" size={20} color="#cbd5e1" />
        <Ionicons name="repeat-sharp" size={24} color="#cbd5e1" />
        <Ionicons name="language" size={20} color="#cbd5e1" />
      </TouchableOpacity>
    </View>
  );
}

function FavButton({ word, handleFavorite }) {
  return (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => {
        handleFavorite(word);
      }}
      className="absolute top-5 left-5"
    >
      <MaterialCommunityIcons
        name={word?.fav ? "cards-heart" : "cards-heart-outline"}
        size={24}
        color={word?.fav ? "#3b82f6" : "#94a3b8"}
      />
    </TouchableOpacity>
  );
}

//Difficulty buttons
function DifficultyButtons({ statuses, handleUpdate }) {
  return (
    <View className="flex flex-row items-center justify-center w-full pb-10 px-5">
      {/** Difficulty Buttons */}
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.name}
          title="difficulty"
          activeOpacity={0.75}
          onPress={() => handleUpdate(status.name)}
          className={`w-1/3 px-2`}
        >
          <View
            className={`text-white text-center rounded-full w-full py-1 ${status.color}`}
          >
            <Text className={`text-white text-center`}>{status.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function EmptyList({}) {
  return (
    <View className="flex-1 flex justify-center items-center space-y-5">
      <Text className="font-bold text-slate-300 text-2xl">
        No Cards To Show
      </Text>
      <Pressable
        onPress={() => {
          router.push("/(tabs)/home");
        }}
        className="bg-slate-500 rounded-3xl px-3 py-2"
      >
        <Text className="text-white">Start Adding</Text>
      </Pressable>
    </View>
  );
}

function PrimaryWord({ word, swap, lang }) {
  return (
    <View className="flex-col items-center justify-center pt-20 pb-10">
      {/* Add Tag */}
      {word.tag && (
        <View
          className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-500`}
        >
          <Ionicons name="pricetag" size={13} color="#94a3b8" />
          <Text className="text-white text-xs">{word.tag}</Text>
        </View>
      )}
      <Text className="font-bold text-white text-center text-3xl pt-5 pb-3">
        {swap ? word.lang2 : word.lang1}
      </Text>
      <SpeechComponent
        text={word.lang1}
        lang={lang}
        autoplay={swap ? false : true}
        size={35}
      />
    </View>
  );
}
