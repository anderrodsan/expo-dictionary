import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchNewWord, fetchSavedWords, updateWord } from "../../data/actions";
import { Ionicons } from "@expo/vector-icons";

const FlashCards = () => {
  const [show, setShow] = useState(false);
  const [word, setWord] = useState(null);

  useEffect(() => {
    fetchNewWord({ setWord });
  }, []);

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
    setShow(false);
    fetchNewWord({ setWord });
  };

  const handleLanguage = () => {
    setLanguage(!language);
    fetchNewWord({ setWord });
  };

  //if language is false == danish -> english | true == english -> danish
  const [language, setLanguage] = useState(false);

  return (
    <SafeAreaView className="bg-slate-800 flex-1 flex-col justify-center items-center w-[100dvh]">
      <View className="flex flex-row w-full items-center justify-center p-5">
        <MaterialCommunityIcons name="cards" size={24} color="white" />
        <Text className="text-white text-xl font-bold pl-3">Flashcards</Text>
      </View>
      {/* Language Selector */}
      <View className="flex flex-row items-center gap-2 mb-5">
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

      {/** Word Card */}
      <View className="flex-1 w-full px-5">
        <View className="relative flex-1 flex-col justify-between items-center border border-slate-700 bg-slate-700/20 rounded-3xl">
          {/** Refresh button */}
          <TouchableOpacity
            title="refresh"
            activeOpacity={0.75}
            onPress={() => {
              fetchNewWord({ setWord }), setShow(false);
            }}
            className="absolute top-5 right-5"
          >
            <Ionicons name="refresh-sharp" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          {/** Word Text */}
          {!word ? (
            <Text className="font-bold text-slate-300 text-2xl pt-32">
              No Cards To Show
            </Text>
          ) : (
            <Text className="font-bold text-white text-4xl pt-32">
              {language ? word.english : word.danish}
            </Text>
          )}

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
      </View>
    </SafeAreaView>
  );
};

export default FlashCards;
