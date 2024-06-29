import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useLanguageList } from "../lib/store/store";
import { fetchSavedWords, getLanguageList } from "../data/actions";
import { findLanguage } from "../data/languageOptions";
import LanguageSelector from "../components/LanguageSelector";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Page() {
  const [show, setShow] = useState(false);

  //zuztand global state for languages
  const { langList, setLangList } = useLanguageList();
  const { lang, setLang } = useLang();

  useEffect(() => {
    //fetch saved words at the begining
    fetchSavedWords().then((savedWords) => {
      //setWordList(savedWords);
      //save the language list in the useStore state from zuztand
      if (savedWords?.length > 0) {
        const langList = getLanguageList(savedWords);
        setLang(langList[0]);
        setLangList(langList);
      } else {
        setLangList([]);
      }
    });

    //set the position 0 and opacity 1
    opacity.value = withTiming(1, { duration: 500 });
    position.value = withTiming(0, { duration: 500 });
  }, []);

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  //Animate the language options with a delay depending on their index
  const opacity = useSharedValue(0);
  const position = useSharedValue(50);

  // Animate only with opacity
  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedWithTransition = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: position.value }],
    };
  });

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-slate-800 text-white">
      <Animated.View
        style={animatedOpacity}
        className="flex flex-col items-center justify-center gap-3 w-full p-10 scale-150"
      >
        <FontAwesome6 name="book" size={50} color="#cbd5e1" />
        <Text className="text-slate-300 font-bold text-3xl">
          Word
          <Text className="text-blue-500">Wise</Text>
        </Text>
      </Animated.View>
      <Animated.Text
        style={animatedOpacity}
        className="text-slate-500 font-bold text-lg mt-10 mb-3"
      >
        Select Language
      </Animated.Text>

      {/** Language selector */}
      {langList?.length > 0 ? (
        <Animated.View
          style={animatedWithTransition}
          className="flex-row justify-center items-center flex-wrap w-full px-5"
        >
          {/** Display the first 3 languages if the list is more than 3 */}
          {langList?.slice(0, 4).map((lang, index) => {
            //Avoid empty item in iOS
            if (lang === "" || null) {
              return null;
            }

            return (
              <Pressable
                className="relative w-1/2 px-2 py-1 rounded-xl bg-slate-600 m-1 flex-row items-center justify-center space-x-1"
                key={index}
                onPress={() => {
                  setLang(lang);
                  router.push("/home");
                }}
              >
                <View className="absolute top-[7px] left-3 opacity-70">
                  <Ionicons name="language" size={20} color="white" />
                </View>

                <Text className="text-white text-base text-center opacity-70">
                  {findLanguage(lang)?.name}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            className="w-1/2 px-2 py-1 rounded-xl bg-blue-500/50 m-1 flex-row items-center justify-center space-x-1"
            onPress={() => {
              setShow(true);
            }}
          >
            <View className="absolute top-[7px] left-3 opacity-70">
              <Ionicons name="add" size={20} color="white" />
            </View>
            <Text className="text-white text-base text-center opacity-70">
              More
            </Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View style={animatedWithTransition}>
          <Pressable
            onPress={() => {
              setShow(true);
            }}
            className="px-3 py-2 rounded-xl bg-blue-500 text-white text-base mt-10 font-light"
          >
            <Text className="text-white text-base text-center">
              Get Started
            </Text>
          </Pressable>
        </Animated.View>
      )}
      <Animated.View
        style={animatedWithTransition}
        className="absolute bottom-10 justify-center items-center space-y-3"
      >
        <Text className="text-slate-500 font-bold text-lg">
          Powered by Ander
        </Text>
        <View className="flex-row items-center space-x-3">
          <Pressable
            className="p-3 rounded-xl bg-slate-700"
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/in/anderrodsan")
            }
          >
            <FontAwesome6 name="linkedin" size={20} color="#94a3b8" />
          </Pressable>
          <Pressable
            className="p-3 rounded-xl bg-slate-700"
            onPress={() => Linking.openURL("https://github.com/anderrodsan")}
          >
            <FontAwesome6 name="github" size={20} color="#94a3b8" />
          </Pressable>
        </View>
      </Animated.View>

      {/** Language selector modal for lang1*/}
      <View className="absolute inset-0 z-40">
        <LanguageSelector
          show={show}
          setShow={setShow}
          lang={lang}
          setLang={setLang}
          handleLanguageChange={() => {
            router.push("/home");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
