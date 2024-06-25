import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({ visible, title, message, onConfirm, onCancel }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="bg-black/50 flex-1 justify-center items-center">
        <View className="w-4/5 bg-slate-700 rounded-lg p-5 items-center">
          <Text className="text-2xl font-bold text-white mb-3">{title}</Text>
          <Text className="text-base text-white mb-5 text-center">
            {message}
          </Text>
          <View className="flex-row justify-between w-full">
            {onCancel && (
              <TouchableOpacity
                className="flex-1 p-2 mx-1 bg-gray-600 rounded-lg items-center"
                onPress={onCancel}
              >
                <Text className="text-white text-base">Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="flex-1 p-2 mx-1 bg-blue-500 rounded-lg items-center"
              onPress={onConfirm}
            >
              <Text className="text-white text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
