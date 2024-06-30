import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Data } from "../../constant/Data";
import { wp } from "../../helpers/Common";
import { theme } from "../../constant/Theme";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";

const Categories = ({ activeCategory, handleChangeCategory }) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      data={Data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
          title={item}
          index={index}
        />
      )}
    />
  );
};

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
  let color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  let backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}>
      <Pressable
        style={[styles.category, { backgroundColor }]}
        onPress={() => handleChangeCategory(isActive ? null : title)}>
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(8),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayGb,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  title: {
    fontWeight: theme.fontWeight.medium,
  },
});
