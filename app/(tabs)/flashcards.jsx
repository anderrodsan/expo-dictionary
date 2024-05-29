import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchNewWord, fetchSavedWords, updateWord } from "../../data/actions";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import SelectCategory from "../../components/SelectCategory";
import SpeechComponent from "../../components/Speech";

const FlashCards = () => {
  const [show, setShow] = useState(false);
  const [word, setWord] = useState(null);
  //if language is false == danish -> english | true == english -> danish
  const [language, setLanguage] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("new");

  useEffect(() => {
    getNewWord();
  }, [filteredStatus]);

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
    setWord(null);
    getNewWord();
    setShow(false);
  };

  const handleLanguage = () => {
    setLanguage(!language);
  };

  const handleFilter = (status) => {
    setFilteredStatus(status);
    setShow(false);
    getNewWord();
  };

  //get the saved word list and choose a random new word to show
  const getNewWord = () => {
    fetchSavedWords().then((savedWords) => {
      setSavedWords(savedWords);
      fetchNewWord({ filteredStatus, word }).then((word) => {
        setWord(word);
      });
      setShow(false);
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
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-center items-center w-[100dvh]">
      <View className="flex flex-row w-full items-center justify-center p-5">
        <MaterialCommunityIcons name="cards" size={24} color="white" />
        <Text className="text-white text-xl font-bold pl-3">Flashcards</Text>
      </View>
      {/* Language Selector */}
      <View className="flex flex-row items-center gap-2">
        <Text className="text-white bg-slate-600 rounded-2xl text-sm w-[70px] text-center py-1">
          {language == false ? "Dansk" : "English"}
        </Text>
        <TouchableOpacity
          title="Submit"
          activeOpacity={0.75}
          onPress={() => handleLanguage()}
        >
          <Ionicons name="repeat-sharp" size={20} color="white" />
        </TouchableOpacity>

        <Text className="text-white bg-slate-700 rounded-2xl text-sm w-[70px] text-center py-1">
          {language == false ? "English" : "Dansk"}
        </Text>
      </View>

      <View className="w-[90%] h-[1px] bg-slate-700 my-3 mx-5" />

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

          {/** Like button */}
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

          {/** Word Text */}
          {!word ? (
            <View className="h-full flex justify-center items-center space-y-5">
              <Text className="font-bold text-slate-300 text-2xl">
                No Cards To Show
              </Text>
              <Link
                href={"(tabs)/home"}
                className="bg-slate-500 rounded-3xl text-white px-3 py-2"
              >
                Start Adding
              </Link>
            </View>
          ) : (
            <View className="h-full flex flex-col justify-between items-center">
              <View className="flex-col items-center justify-center pt-28 pb-10">
                {/* Add Tag */}
                {word.tag && (
                  <View
                    className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-500`}
                  >
                    <Ionicons name="pricetag" size={13} color="#94a3b8" />
                    <Text className="text-white text-xs">{word.tag}</Text>
                  </View>
                )}
                <Text className="font-bold text-white text-4xl py-3">
                  {language ? word.english : word.danish}
                </Text>
                <SpeechComponent
                  text={language ? word.english : word.danish}
                  lang={language ? "en" : "da"}
                  size={35}
                />
              </View>

              {/** Show Word and Buttons */}
              {show && (
                <Text className="text-blue-500 text-3xl font-bold pb-32">
                  {language ? word.danish : word.english}
                </Text>
              )}
              {show ? (
                <View className="flex flex-row items-center justify-center space-x-5 w-full p-10">
                  {statuses.map((status) => (
                    <TouchableOpacity
                      key={status.name}
                      title="difficulty"
                      activeOpacity={0.75}
                      onPress={() => handleUpdate(status.name)}
                    >
                      <Text
                        className={`text-white text-center rounded-full w-[80px] py-2 ${status.color}`}
                      >
                        {status.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TouchableOpacity
                  title="Submit"
                  activeOpacity={0.75}
                  onPress={() => setShow(!show)}
                >
                  <Text className=" text-white text-xl font-bold pb-20 opacity-30">
                    Tap to reveal
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FlashCards;
