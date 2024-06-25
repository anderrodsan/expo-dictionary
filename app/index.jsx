import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang, useLanguageList } from "../lib/store/store";
import { fetchSavedWords, getLanguageList } from "../data/actions";
import { findLanguage } from "../data/languageOptions";
import LanguageSelector from "../components/LanguageSelector";

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
  }, []);

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <SafeAreaView className="relative flex-1 items-center justify-center bg-slate-800 text-white">
      <View className="flex flex-col items-center justify-center gap-3 w-full p-10 scale-150">
        <FontAwesome6 name="book" size={50} color="#cbd5e1" />
        <Text className="text-slate-300 font-bold text-3xl">
          Word
          <Text className="text-blue-500">Wise</Text>
        </Text>
      </View>
      <Text className="text-slate-500 font-bold text-lg mt-10 mb-3">
        Select Language
      </Text>

      {/** Language selector */}
      {langList?.length > 0 ? (
        <View className="flex-row justify-center items-center flex-wrap w-full px-5">
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
        </View>
      ) : (
        <Pressable
          onPress={() => {
            setShow(true);
          }}
          className="px-3 py-2 rounded-xl bg-blue-500 text-white text-base mt-10 font-light"
        >
          <Text className="text-white text-base text-center">Get Started</Text>
        </Pressable>
      )}
      <Text className="absolute bottom-10 text-slate-500 font-bold text-lg">
        Powered by Andr
      </Text>

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
