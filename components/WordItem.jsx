import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatDateLabel } from "../lib/utils";
import { Ionicons, Foundation } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeWord, updateWord } from "../data/actions";
import SpeechComponent from "./Speech";
import OptionsDrawer from "./OptionsDrawer";
import EditWord from "./EditWord";

const WordItem = ({ item, index, savedWords, handleRefresh, hide, lang }) => {
  const [word, setWord] = useState(item);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(!hide);
  }, [hide]);

  const handleRemove = useCallback(
    (word) => {
      removeWord({ word }).then(() => {
        handleRefresh();
        setShow(false);
        setEdit(false);
      });
    },
    [handleRefresh]
  );

  const handleFavorite = useCallback(
    (word) => {
      word.fav = !word.fav;
      updateWord({ word }).then(() => {
        handleRefresh();
        setEdit(false);
        setShow(false);
      });
    },
    [handleRefresh]
  );

  const handleEdit = () => {
    setShow(false);
    setEdit(true);
  };

  const dateLabel = useMemo(() => {
    return index === 0 || savedWords[index - 1].date !== item.date ? (
      <View className={`text-xs mb-1 flex flex-row space-x-1 py-1`}>
        <Text className="text-blue-500 font-bold">
          {formatDateLabel(item.date)}
        </Text>
        <Text className="text-blue-500 font-bold">
          ({savedWords.filter((word) => word.date === item.date).length})
        </Text>
      </View>
    ) : null;
  }, [item.date, index, savedWords]);

  const translationStatusTag = useMemo(() => {
    return item.status !== "Easy" ? (
      <Pressable
        className={`rounded-full
        ${item.status === "Hard" && "bg-blue-700 h-3 w-3"}
        ${item.status === "Medium" && "bg-orange-500 h-3 w-3"}
        `}
        onPress={() => setShow(true)}
      >
        {item.status === "new" && (
          <View className="">
            <Foundation name="burst-new" size={22} color="#3b82f6" />
          </View>
        )}
      </Pressable>
    ) : null;
  }, [item.status]);

  const tagView = useMemo(() => {
    return item.tag ? (
      <View
        className={`flex flex-row items-center space-x-2 rounded-full px-3 py-[2px] border border-slate-500`}
      >
        <Ionicons name="pricetag" size={13} color="#94a3b8" />
        <Text className="text-white text-xs opacity-80">{item.tag}</Text>
      </View>
    ) : null;
  }, [item.tag]);

  const typeView = useMemo(() => {
    return item.type === "0" ? (
      <FlatList
        className="flex-1"
        horizontal
        data={item.type}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <Text className={`text-white text-xs rounded-3xl opacity-70`}>
            {index !== 0 && " | "}
            {item}
          </Text>
        )}
      />
    ) : null;
  }, [item.type]);

  return (
    <View className="relative">
      {dateLabel}

      <View
        className={`flex flex-row justify-between items-center p-3 mr-5 rounded-xl mb-2 border ${
          item.fav ? "border-blue-500/80" : "border-slate-700"
        }`}
      >
        <Pressable
          onPress={() => {
            if (hide) setShowTranslation(!showTranslation);
          }}
          className="flex-1 flex-col items-start justify-center"
        >
          <View className="flex-1 flex-row justify-start items-center space-x-2">
            <Text className="max-w-[90%] text-white font-bold text-lg pr-2">
              {item.lang1}
            </Text>
            <SpeechComponent
              text={item.lang1}
              lang={lang}
              size={22}
              autoplay={false}
            />
            {translationStatusTag}
            {tagView}
          </View>

          <View className="flex-1 flex-row justify-start items-center space-x-3">
            <Text
              className={`text-base opacity-80 ${
                showTranslation ? "text-white" : "text-slate-800"
              }`}
            >
              {item.lang2}
            </Text>
            {typeView}
          </View>
        </Pressable>

        <View
          className={`absolute right-0 h-full flex-row items-center bg-slate-800 z-40 py-3 pr-2`}
        >
          {item.fav && (
            <TouchableOpacity
              title="Submit"
              activeOpacity={0.75}
              onPress={() => handleFavorite(item)}
              className="mr-1"
            >
              <MaterialCommunityIcons
                name="cards-heart"
                size={24}
                color="#3b82f6"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            title="Submit"
            activeOpacity={0.75}
            onPress={() => setShow(!show)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="#cbd5e1"
            />
          </TouchableOpacity>
        </View>

        <EditWord word={item} visible={edit} setVisible={setEdit} />
        <View className="absolute inset-0">
          <OptionsDrawer
            word={item}
            lang={lang}
            show={show}
            setShow={setShow}
            handleEdit={handleEdit}
            handleFavorite={handleFavorite}
            handleRemove={handleRemove}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(WordItem);
