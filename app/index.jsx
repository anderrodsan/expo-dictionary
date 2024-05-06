import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Page() {
  return (
    <View className="relative flex-1 items-center justify-center bg-slate-800 text-white">
      <View className="flex flex-col items-center justify-center gap-3 w-full p-10 scale-150">
        <FontAwesome6 name="book" size={50} color="#cbd5e1" />
        <Text className="text-slate-300 font-bold text-3xl">
          Word
          <Text className="text-blue-500">Wise</Text>
        </Text>
      </View>
      <Link
        href={"/home"}
        className="px-3 py-2 rounded-xl bg-blue-500 text-white text-base mt-10 font-light"
      >
        Get Started
      </Link>
      <Text className="absolute bottom-32 text-slate-500 font-bold text-lg">
        Powered by Andr
      </Text>
      <StatusBar backgroundColor="#ffffff" style="light" />
    </View>
  );
}
