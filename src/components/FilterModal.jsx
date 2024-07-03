import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "../../helpers/Common";
import { theme } from "../../constant/Theme";
import {
  ColorFilter,
  CommonFilterRow,
  SectionView,
} from "../components/filterViews";
import { Data } from "../../constant/Data";

const FilterModal = ({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <View>
      <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={customBackdrop}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.filterText}>Filters</Text>
            {Object.keys(sections).map((sectionName, index) => {
              let title = capitalize(sectionName);
              let sectionView = sections[sectionName];
              let sectionData = Data.filters[sectionName];
              return (
                <Animated.View
                  key={sectionName}
                  entering={FadeInDown.delay(index * 100 + 100)
                    .springify()
                    .damping(11)}
                >
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName,
                    })}
                  />
                </Animated.View>
              );
            })}

            <Animated.View
              style={styles.buttons}
              entering={FadeInDown.delay(500).springify().damping(11)}
            >
              <Pressable style={styles.resetButton} onPress={onReset}>
                <Text
                  style={[
                    styles.butonText,
                    { color: theme.colors.neutral(0.9) },
                  ]}
                >
                  Reset
                </Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={onApply}>
                <Text style={[styles.butonText, { color: theme.colors.white }]}>
                  Apply
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const sections = {
  order: (prop) => <CommonFilterRow {...prop} />,
  orientation: (prop) => <CommonFilterRow {...prop} />,
  type: (prop) => <CommonFilterRow {...prop} />,
  colors: (prop) => <ColorFilter {...prop} />,
};

const customBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={10} />
    </Animated.View>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: hp(8),
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.grayGb,
  },
  butonText: {
    fontSize: hp(4.4),
  },
});
