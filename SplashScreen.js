import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
    const logoY = useRef(new Animated.Value(-100)).current;
    const logoScale = useRef(new Animated.Value(1)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;
    const wrapperOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bounce in the logo
    Animated.spring(logoY, {
        toValue: 0,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
    }).start(() => {
        Animated.parallel([
          Animated.timing(logoY, {
            toValue: -height * 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeOut, {
            toValue: 0,
            duration: 400,
            delay: 800,
            useNativeDriver: true,
          }),
          Animated.timing(wrapperOpacity, {
            toValue: 1,
            duration: 500,
            delay: 800,
            useNativeDriver: true,
          }),
        ]).start();
      });
  }, []);

  return (
    <View style={styles.container}>
        <Animated.View
            style={{
            transform: [
                { translateY: logoY },
                { scale: logoScale },
            ],
            opacity: fadeOut,
            alignItems: "center",
            }}
        >
            <Image
            source={require("./assets/images/logo.png")}
            style={styles.logo}
            />
            <Text style={styles.title}>SITSMART</Text>
        </Animated.View>

        <Animated.Image
            source={require("./assets/images/logo-wrapper.png")}
            style={[
            styles.wrapperLogo,
            { opacity: wrapperOpacity },
            ]}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Hyperion-Regular",
    fontSize: 40,
    color: "#000000",
    position: "absolute",
    top: height/8, // initial position below the logo
  },
});