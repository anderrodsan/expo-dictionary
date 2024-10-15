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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import FavButton from "./FavButton";

const WordItem = ({
  item,
  index,
  savedWords,
  handleRefresh,
  hide,
  lang,
  sort,
  viewableItems,
  selectedItems,
  setSelectedItems,
  multiSelect,
  setMultiSelect,
}) => {
  const [word, setWord] = useState(item);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setShowTranslation(!hide);
  }, [hide]);

  const handleRemove = useCallback(
    (word) => {
      removeWord({ word }).then(() => {
        setWord(null);
        setShow(false);
        setEdit(false);
      });
    },
    [handleRefresh]
  );

  const handleFavorite = useCallback((word) => {
    // Create a new word object with the updated favorite status
    const updatedWord = { ...word, fav: !word.fav };
    setWord(updatedWord);
    setShow(false);
    updateWord({ word: updatedWord });
  }, []);

  const handleEdit = () => {
    setShow(false);
    setEdit(true);
  };

  //Animation when hiding the translation
  const opacity = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => {
    opacity.value = withTiming(showTranslation ? 0.8 : 0, { duration: 200 });
    return {
      opacity: opacity.value,
    };
  }, [showTranslation]);

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

  //Show the words first letter for the sorted list without repeating them, as the date
  const firstLetter = useMemo(() => {
    return index === 0 ||
      savedWords[index - 1].lang1.charAt(0) !== item.lang1.charAt(0) ? (
      <View className={`text-xs mb-1 flex flex-row space-x-1 py-1`}>
        <Text className="text-blue-500 font-bold">
          {item.lang1.charAt(0).toUpperCase()} (
          {
            savedWords.filter(
              (word) => word.lang1.charAt(0) === item.lang1.charAt(0)
            ).length
          }
          )
        </Text>
      </View>
    ) : null;
  });

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

  //inView animations
  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item.id === item.id)
    );

    return {
      opacity: isVisible ? withTiming(1) : withTiming(0),
      transform: [
        {
          scale: isVisible
            ? withSpring(1, { damping: 10, stiffness: 100 })
            : withSpring(0.8, {
                damping: 5,
                stiffness: 100,
              }),
        },
      ],
    };
  }, []);

  if (word === null) {
    return null;
  }

  return (
    <Animated.View
      style={rStyle}
      className={`relative ${index === 0 && "mt-0"}`}
    >
      {sort ? firstLetter : dateLabel}

      <View
        className={`flex flex-row justify-between items-center p-3 mr-5 rounded-xl mb-2 border overflow-hidden transition ease-in-out duration-300 ${
          word.fav ? "border-blue-500/80" : "border-slate-700"
        }
        
        `}
      >
        <TouchableOpacity
          activeOpacity={hide ? 0.75 : 1}
          onPress={() => {
            if (hide) setShowTranslation(!showTranslation);
            /*
            if (multiSelect) {
              setSelected(!selected);
              if (selectedItems.includes(item)) {
                if (selectedItems.length === 1) {
                  setMultiSelect(false);
                }
                setSelectedItems(selectedItems.filter((w) => w !== item));
              } else {
                setSelectedItems([...selectedItems, item]);
              }
            }
              */
          }}
          /*
          onLongPress={() => {
            if (!multiSelect) {
              setSelectedItems([item]);
              setSelected(true);
              setMultiSelect(true);
            } else {
              setSelected(!selected);
              if (selectedItems.includes(item)) {
                setSelectedItems(selectedItems.filter((w) => w !== item));
              } else {
                setSelectedItems([...selectedItems, item]);
              }
            }
            console.log("Mult select", multiSelect);
          }}
            */
          className="flex-1 flex-col items-start justify-center"
        >
          <View className="flex-1 max-w-[70%] flex-row justify-start items-center space-x-2">
            <Text className="whitespace-nowrap text-white font-bold text-lg pr-2">
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
            <Animated.Text
              style={animatedStyle}
              className={`text-base text-white
              `}
            >
              {item.lang2}
            </Animated.Text>
            {typeView}
          </View>
        </TouchableOpacity>

        <View
          className={`absolute right-0 h-full flex-row items-center z-40 py-3 pr-2 ${
            !selected && "bg-slate-800"
          }`}
        >
          <FavButton word={word} handleFavorite={handleFavorite} />
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
            word={word}
            lang={lang}
            show={show}
            setShow={setShow}
            handleEdit={handleEdit}
            handleFavorite={handleFavorite}
            handleRemove={handleRemove}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default React.memo(WordItem);
