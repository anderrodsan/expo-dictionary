import React from "react";
import { Pressable, View, ViewBase } from "react-native";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

export default function SpeechComponent({
  text,
  lang,
  size,
  className,
}: {
  text: string;
  lang: string;
  size: number;
  className?: any;
}) {
  const [playing, setPlaying] = useState(false);

  const speak = () => {
    setPlaying(true);
    Speech.speak(text, { language: lang, onDone: () => setPlaying(false) });
  };

  return (
    <Pressable onPress={speak}>
      <MaterialCommunityIcons
        name={playing ? "volume-high" : "volume-medium"}
        size={size}
        color={playing ? "#3b82f6" : "#94a3b8"}
      />
    </Pressable>
  );
}
