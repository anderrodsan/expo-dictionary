import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { formatDateLabel } from "../lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeWord, updateWord } from "../data/actions";
import SpeechComponent from "./Speech";

const WordItem = ({ item, index, savedWords, handleRefresh }) => {
  const [show, setShow] = useState(false);

  const handleRemove = (word) => {
    console.log("word", word);
    removeWord({ word }).then(() => {
      handleRefresh();
    });
  };

  const handleFavorite = (word) => {
    //add new value pair fav: true or false
    word.fav = word.fav ? !word.fav : true;
    console.log("word", word);
    updateWord(word).then(() => {
      handleRefresh();
    });
  };

  return (
    <View className="relative">
      {(index === 0 || savedWords[index - 1].date !== item.date) && (
        <View className={` text-xs mb-1 flex flex-row space-x-1 py-1`}>
          <Text className="text-blue-500 font-bold">
            {formatDateLabel(item.date)}
          </Text>

          {/** Add count number of words in that date */}
          <Text className="text-blue-500 font-bold">
            ({savedWords.filter((word) => word.date === item.date).length})
          </Text>
        </View>
      )}

      <View
        className={`flex flex-row justify-between items-center p-3 mr-5 rounded-xl mb-2 border ${
          item.fav ? "border-blue-500" : " border-slate-700"
        }`}
      >
        <View className="flex-1 flex-col items-start justify-center">
          <View className="flex-1 flex-row justify-start items-center space-x-2">
            <Text className="max-w-[90%] text-white font-bold text-lg pr-2">
              {item.danish}
            </Text>
            <SpeechComponent text={item.danish} lang={"da"} size={22} />
            {/* Add Status */}
            {item.status === "Easy" ? null : (
              <Text
                className={`text-white text-xs rounded-full
                ${item.status === "Hard" && " bg-blue-700 h-3 w-3"}
                ${item.status === "Medium" && " bg-orange-500 h-3 w-3"}
                ${item.status === "new" && " bg-blue-500 py-[2px] px-3"}
                `}
              >
                {item.status === "new" && "new"}
              </Text>
            )}
            {/* Add Tag */}
            {item.tag && (
              <View
                className={`flex flex-row items-center space-x-2 rounded-full px-3 py-[2px] border border-slate-500`}
              >
                <Ionicons name="pricetag" size={13} color="#94a3b8" />
                <Text className="text-white text-xs opacity-80">
                  {item.tag}
                </Text>
              </View>
            )}
          </View>

          {/** Add Type */}
          <View className="flex-1 flex-row justify-start items-center space-x-3">
            <Text className="text-white text-base opacity-80">
              {item.english}
            </Text>
            {item.type == "0" && (
              <FlatList
                className="flex-1"
                horizontal
                data={item.type}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <Text className={`text-white text-xs rounded-3xl opacity-70`}>
                    {index != 0 && " | "}
                    {item}
                  </Text>
                )}
              />
            )}
          </View>
        </View>

        {/** Add popover with options */}
        <View
          className={`flex-row items-center bg-slate-800 z-40 py-3 rounded-xl ${
            show ? "bg-blue-500 px-2 space-x-3" : "space-x-1"
          }`}
        >
          {/** Add favorite button if favorite */}
          {item.fav && !show && (
            <TouchableOpacity
              title="Submit"
              activeOpacity={0.75}
              onPress={() => {
                handleFavorite(item);
              }}
              className=""
            >
              <MaterialCommunityIcons
                name="cards-heart"
                size={24}
                color="#3b82f6"
              />
            </TouchableOpacity>
          )}
          {/** Open popover */}
          {show && (
            <View className="flex-row items-center space-x-3">
              {/** Add delete button */}
              <TouchableOpacity
                title="Submit"
                activeOpacity={0.75}
                onPress={() => handleRemove(item)}
                className=""
              >
                <MaterialCommunityIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
              {/** Add favorite button */}
              <TouchableOpacity
                title="Submit"
                activeOpacity={0.75}
                onPress={() => {
                  handleFavorite(item);
                }}
                className="ml-2"
              >
                <MaterialCommunityIcons
                  name={item.fav ? "heart-off" : "cards-heart-outline"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            title="Submit"
            activeOpacity={0.75}
            onPress={() => setShow(!show)}
          >
            <MaterialCommunityIcons
              name={show ? "close" : "dots-vertical"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WordItem;
