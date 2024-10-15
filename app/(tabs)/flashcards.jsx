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
import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
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
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import SavedCategory from "../../components/SavedCategory";
import { getCurrentDate } from "../../lib/utils";

const FlashCards = () => {
  //open the drawer and show the word
  const [openDrawer, setOpenDrawer] = useState(false);
  const [show, setShow] = useState(false);

  //loading new word
  const [loading, setLoading] = useState(false);

  //change the language
  const [swap, setSwap] = useState(false);

  //set word review limit to once per day
  const [limit, setLimit] = useState(true);

  //zuztand global state for languages
  const { langList, setLangList } = useLanguageList();
  const { lang, setLang } = useLang();

  //displayed word, wordlist and status filter
  const [word, setWord] = useState(null);
  const [savedWords, setSavedWords] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");

  //Animation for opacity
  const opacity = useSharedValue(0);
  const position = useSharedValue(0);
  const rotate = useSharedValue(0);

  //Change opacity to 0 and after 300 ms to 1 once the show is true
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: position.value }],
    };
  });

  const flipAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value}deg` }],
    };
  }, []);

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${-rotate.value}deg` }],
    };
  });

  const flipCard = () => {
    //flip the card 180  degrees
    rotate.value = withTiming(rotate.value + 180, { duration: 500 });
  };

  useEffect(() => {
    opacity.value = withTiming(show ? 1 : 0, { duration: 300 });
    position.value = withTiming(show ? 0 : 20, { duration: 200 });
  }, [show]);

  useEffect(() => {
    getNewWord();
  }, [filteredStatus, lang, limit]);

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

    //if the status is easy, nextReview is date + 7 days
    const today = new Date();
    /*
    const newDate =
      status === "Easy"
        ? today.setDate(today.getDate() + 7)
        : today.setDate(today.getDate() + 1);
    const nextReview = new Date(newDate).toISOString().split("T")[0];
    */

    const updatedWord = {
      ...word,
      status: status,
      lastReviewed: getCurrentDate(),
      //nextReview: nextReview,
    };
    updateWord({ word: updatedWord });
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
    if (word) {
      flipCard();
    }
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
      if (!word && filteredStatus !== "All") {
        setFilteredStatus("All");
      }
    });
  };

  const handleFavorite = (word) => {
    const updatedWord = { ...word, fav: !word.fav };
    setWord(updatedWord);
    updateWord({ word: updatedWord });
  };

  return (
    <View className="relative bg-slate-800 flex-1 flex-col justify-center items-center w-[100dvh]">
      <View className="flex flex-row w-full items-center justify-start p-5">
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
      <View className="w-full pb-4">
        <SavedCategory
          category={filteredStatus}
          setCategory={setFilteredStatus}
          savedWords={savedWords}
        />
      </View>

      {/** Word Card */}
      <Animated.View
        style={flipAnimatedStyle}
        className="flex-1 w-full px-5 pb-5"
      >
        <Animated.View
          style={contentStyle}
          className={`relative flex-1 flex-col justify-between items-center border  bg-slate-700/20 rounded-3xl ${
            word?.fav ? "border-blue-500" : "border-slate-700"
          }`}
        >
          {/** Refresh button */}
          <RefreshButton getNewWord={getNewWord} />
          {/** Language swap button */}
          <LanguageSwitcher handleLanguage={handleLanguage} />
          {/** Like button */}
          <FavButton word={word} handleFavorite={handleFavorite} />

          {/** Word Text */}
          {!word ? (
            <EmptyList
              savedWords={savedWords}
              limit={limit}
              setLimit={setLimit}
            />
          ) : (
            <View className="flex-1 flex flex-col justify-between items-center">
              <PrimaryWord word={word} swap={swap} lang={lang} />

              {/** Secondary word */}
              {show && !loading && (
                <Animated.Text
                  style={animatedStyle}
                  className="text-blue-500 text-2xl text-center font-bold"
                >
                  {swap ? word.lang1 : word.lang2}
                </Animated.Text>
              )}

              {/** Loading  */}
              {loading && (
                <View className="flex justify-center items-center">
                  <ActivityIndicator size="large" color="#3b82f6" />
                </View>
              )}

              {/** Difficulty Buttons or RevealButton */}
              {show && !loading ? (
                <Animated.View style={animatedStyle}>
                  <DifficultyButtons
                    word={word}
                    statuses={statuses}
                    handleUpdate={handleUpdate}
                  />
                </Animated.View>
              ) : (
                <TouchableOpacity
                  title="Submit"
                  activeOpacity={0.75}
                  onPress={() => {
                    setShow(!show);
                    //flipCard();
                  }}
                >
                  <Text className=" text-white text-xl font-bold pb-10 opacity-30">
                    Tap to reveal
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default FlashCards;

function RefreshButton({ getNewWord }) {
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  function handleRefresh() {
    //set opacity to 0 and after 300 ms to 1
    opacity.value = 0.5;
    getNewWord();
    rotate.value = withTiming(rotate.value + 360, { duration: 300 });
    opacity.value = withTiming(1, { duration: 1000 });
  }

  return (
    <TouchableOpacity
      title="refresh"
      activeOpacity={0.75}
      onPress={() => {
        handleRefresh();
      }}
      className="absolute top-5 right-5"
    >
      <Animated.View style={animatedIconStyle}>
        <Ionicons name="refresh-sharp" size={24} color="#cbd5e1" />
      </Animated.View>
    </TouchableOpacity>
  );
}

function LanguageSwitcher({ handleLanguage }) {
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const [swap, setSwap] = useState(false);

  function handleSwap() {
    //set opacity to 0 and after 300 ms to 1
    opacity.value = 0.5;
    handleLanguage();

    //if swap rotate to one side and if not swap rotate to other side
    if (swap) {
      rotate.value = withTiming(rotate.value - 180, { duration: 300 });
    } else {
      rotate.value = withTiming(rotate.value + 180, { duration: 300 });
    }
    setSwap(!swap);
    opacity.value = withTiming(1, { duration: 1000 });
  }

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <View className="pt-4">
      <TouchableOpacity
        title="Submit"
        activeOpacity={0.75}
        className="flex-row items-center space-x-1 px-3 py-1 bg-slate-700 rounded-xl"
        onPress={() => handleSwap()}
      >
        <Animated.View style={{ opacity: opacity }}>
          <Ionicons
            name="language"
            size={20}
            color={swap ? "#cbd5e1" : "#3b82f6"}
          />
        </Animated.View>
        <Animated.View style={animatedIconStyle}>
          <Ionicons name="repeat-sharp" size={24} color="#cbd5e1" />
        </Animated.View>

        <Animated.View style={{ opacity: opacity }}>
          <Ionicons
            name="language"
            size={20}
            color={swap ? "#3b82f6" : "#cbd5e1"}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

function FavButton({ word, handleFavorite }) {
  //Animation

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  function animateIn() {
    opacity.value = 0;
    scale.value = 0;
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 5, stiffness: 100 });
  }

  function animateOut() {
    opacity.value = 1;
    scale.value = 1;
    opacity.value = withTiming(0, { duration: 600 });
    scale.value = withSpring(0, { damping: 5, stiffness: 100 });
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => {
        handleFavorite(word);
        animateIn();
      }}
      className="absolute top-5 left-5"
    >
      {word?.fav ? (
        <Animated.View style={animatedStyle}>
          <MaterialCommunityIcons
            name={"cards-heart"}
            size={24}
            color={"#3b82f6"}
          />
        </Animated.View>
      ) : (
        <Animated.View style={animatedStyle} className="opacity-70">
          <MaterialCommunityIcons
            name={"cards-heart-outline"}
            size={24}
            color={"#cbd5e1"}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

//Difficulty buttons
function DifficultyButtons({ word, statuses, handleUpdate }) {
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
            className={`text-white text-center rounded-full w-full py-1 ${
              status.color
            } ${
              status.name === word.status
                ? "opacity-100 border border-slate-600"
                : "opacity-80"
            }`}
          >
            <Text
              className={`text-white text-center ${
                status.name === word.status && "font-semibold"
              }`}
            >
              {status.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function EmptyList({ savedWords, limit, setLimit }) {
  return (
    <View className="flex-1 flex justify-center items-center space-y-5">
      {savedWords.length > 0 && limit ? (
        <View className="flex-1 flex justify-center items-center space-y-5">
          <Text className="font-bold text-slate-300 text-2xl">
            "Enough for today"
          </Text>
          <Pressable
            onPress={() => {
              setLimit(false);
            }}
            className="bg-slate-500 rounded-3xl px-3 py-2"
          >
            <Text className="text-white">Keep learning</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 flex justify-center items-center space-y-5">
          <Text className="font-bold text-slate-300 text-2xl">
            "No words saved yet"
          </Text>
          <Pressable
            onPress={() => {
              router.push("/(tabs)/home");
            }}
            className="bg-slate-500 rounded-3xl px-3 py-2"
          >
            <Text className="text-white">Add more words</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function PrimaryWord({ word, swap, lang }) {
  return (
    <View className="flex-col items-center justify-center pt-20 pb-10 px-5">
      <View className="flex flex-row items-center gap-2">
        {/* Add Tag */}
        {word.tag && (
          <View
            className={`flex flex-row items-center space-x-2 rounded-full px-3 py-1 border border-slate-500`}
          >
            <Ionicons name="pricetag" size={13} color="#94a3b8" />
            <Text className="text-white text-xs">{word.tag}</Text>
          </View>
        )}
        <View
          className={`rounded-full
        ${word.status === "Hard" && "bg-blue-700 h-3 w-3"}
        ${word.status === "Medium" && "bg-orange-500 h-3 w-3"}
        ${word.status === "Easy" && "bg-slate-500 h-3 w-3"}
        `}
          onPress={() => setShow(true)}
        >
          {word.status === "new" && (
            <View className="">
              <Foundation name="burst-new" size={22} color="#3b82f6" />
            </View>
          )}
        </View>
      </View>
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
