import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, hp, wp } from "../../helpers/Common";
import { theme } from "../../constant/Theme";

const ImageCard = ({ item, index, columns, router }) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
      style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayGb,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: hp(2),
  },
});
