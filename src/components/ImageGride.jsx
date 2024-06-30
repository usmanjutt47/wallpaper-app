import { StyleSheet, View } from "react-native";
import React from "react";
import ImageCard from "./ImageCard";
import { MasonryFlashList } from "@shopify/flash-list";
import { getColumnCount, wp } from "../../helpers/Common";

const ImageGride = ({ images }) => {
  const columns = getColumnCount(images);
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initailNumToRender={1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} columns={columns} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGride;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(8),
  },
});
