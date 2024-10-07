import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const SelectCategory = ({ filteredStatus, setFilteredStatus, savedWords }) => {
  const statuses = [
    {
      name: "All",
      color: "border border-slate-500 bg-blue-500",
    },
    {
      name: "New",
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

  return (
    <ScrollView horizontal className="w-full pb-3">
      <TouchableOpacity
        title="difficulty"
        activeOpacity={0.75}
        onPress={() => setFilteredStatus("All")}
        className={`rounded-full px-3 py-1 border ${
          filteredStatus === "new"
            ? "bg-blue-500 border-blue-500"
            : " border-slate-500"
        }`}
      >
        <Text className="text-white text-xs text-center">
          All ({savedWords.length})
        </Text>
      </TouchableOpacity>
      {statuses.map((status) => {
        const wordCount = savedWords.filter(
          (word) => word.status.toLowerCase() === status.name.toLowerCase()
        );

        return (
          <TouchableOpacity
            key={status.name}
            title="difficulty"
            activeOpacity={0.75}
            onPress={() => setFilteredStatus(status.name)}
            className={`rounded-full px-3 py-1 border 
              ${
                filteredStatus === status.name
                  ? status.color + " border-" + status.color
                  : " border-slate-500"
              }
              `}
          >
            <Text className="text-white text-xs text-center">
              {status.name} ({wordCount.length})
            </Text>
          </TouchableOpacity>
        );
      })}
      {/* Same as the map but using flatlist */}
      <FlatList
        horizontal
        data={statuses}
        renderItem={({ item }) => (
          <TouchableOpacity
            title="difficulty"
            activeOpacity={0.75}
            onPress={() => setFilteredStatus(item.name)}
            className={`rounded-full px-3 py-1 border ${
              filteredStatus === item.name
                ? item.color + " border-" + item.color
                : " border-slate-500"
            }`}
          >
            <Text className="text-white text-xs text-center">
              {item.name} ({savedWords.length})
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

export default SelectCategory;
