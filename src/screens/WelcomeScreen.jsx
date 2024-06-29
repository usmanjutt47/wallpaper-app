import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp } from "../../helpers/Common";
import { theme } from "../../constant/Theme";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/images/welcome1.png")}
        resizeMode="cover"
        style={styles.bgImage}
      />
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "#fff",
            "#fff",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
        <View style={styles.contentContainer}>
          <Animated.Text
            style={styles.title}
            entering={FadeInDown.delay(400).springify()}>
            Pixels
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(500).springify()}
            style={styles.puchLine}>
            Every Pixels Tells a Story
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable
              style={styles.startButton}
              onPress={() => navigation.navigate("HomeScreen")}>
              <Text style={styles.startText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  gradient: {
    width: "100%",
    height: "65%",
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(14),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeight.bold,
  },
  puchLine: {
    fontSize: hp(4),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: theme.fontWeight.medium,
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(6),
    fontWeight: theme.fontWeight.medium,
    letterSpacing: 1,
  },
});
