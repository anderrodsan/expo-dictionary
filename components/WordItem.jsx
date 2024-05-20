import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { formatDateLabel } from "../lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeWord } from "../data/actions";
import SpeechComponent from "./Speech";

const WordItem = ({ item, index, savedWords, setSavedWords }) => {
  return (
    <View className="">
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

      <View className="flex flex-row justify-between items-center p-3 border border-slate-700 mr-5 rounded-xl mb-2">
        <View className="flex-1 flex-col items-start justify-center">
          <View className="flex-1 flex-row justify-start items-center space-x-3">
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
                ${item.status === "new" && " bg-blue-500 py-1 px-3"}
                `}
              >
                {item.status === "new" && "new"}
              </Text>
            )}
            {/* Add Tag */}
            {item.tag && (
              <View
                className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-500`}
              >
                <Ionicons name="pricetag" size={13} color="#94a3b8" />
                <Text className="text-white text-xs">{item.tag}</Text>
              </View>
            )}
          </View>

          {/** Add Type */}
          <View className="flex-1 flex-row justify-start items-center space-x-3">
            <Text className="text-white text-base">{item.english}</Text>
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

        {/** Add delete button */}
        <TouchableOpacity
          title="Submit"
          activeOpacity={0.75}
          onPress={() => removeWord({ setSavedWords, word: item.danish })}
          className="ml-2"
        >
          <MaterialCommunityIcons name="delete" size={24} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WordItem;
