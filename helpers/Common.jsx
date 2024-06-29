import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
export const wp = (persentage) => {
  const width = deviceWidth;
  return (persentage * width) / 100;
};
export const hp = (persentage) => {
  const height = deviceWidth;
  return (persentage * height) / 100;
};
