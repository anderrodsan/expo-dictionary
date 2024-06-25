import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

export default function BottomSheet(props, ref) {
  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <BottomSheetView className="flex-1 justify-center bg-slate-700">
        <Text className="text-white text-center">Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
