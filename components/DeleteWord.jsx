import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { removeWord } from "../data/actions";

const DeleteWord = ({ wordId, setSavedWords }) => {
  return (
    <TouchableOpacity
      title="Submit"
      activeOpacity={0.75}
      onPress={() => removeWord({ setSavedWords, wordId })}
    >
      <MaterialCommunityIcons name="delete" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default DeleteWord;

const styles = StyleSheet.create({});
