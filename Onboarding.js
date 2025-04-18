import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { height, width } = Dimensions.get("window");

export default function Onboarding01Light({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <Image
        source={require("./assets/images/logo-wrapper.png")}
        style={styles.logo}
      />

      {/* Illustration + Caption */}
      <View style={styles.body}>
        <Image
          source={require("./assets/images/onboarding1.png")} // Replace with your actual image
          style={styles.illustration}
        />
        <Text style={styles.caption}>
          <Text style={{ fontFamily: "Gilroy-Regular" }}>Book the </Text>
          <Text style={{ fontFamily: "Gilroy-ExtraBold" }}>right </Text>
          <Text style={{ fontFamily: "Gilroy-Regular" }}>
            classroom or study space —{"\n"}anytime, anywhere!
          </Text>
        </Text>
      </View>

      {/* Carousel Dots */}
      <View style={styles.dots}>
        <View style={styles.dotActive} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Get Started Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingTop: 80,
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      width: 160,
      height: 50,
      resizeMode: "contain",
      marginTop: 20,
    },
    body: {
      alignItems: "center",
      justifyContent: "center",
    },
    illustration: {
      width: width * 0.8,
      height: height * 0.35,
      resizeMode: "contain",
      marginBottom: 20,
    },
    caption: {
      fontSize: 16,
      fontFamily: "Gilroy-Regular",
      textAlign: "center",
      color: "#333",
      lineHeight: 24,
    },
    dots: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#bbb",
    },
    dotActive: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#333",
    },
    button: {
      backgroundColor: "#007bff",
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
      marginBottom: 40,
    },
    buttonText: {
      fontFamily: "Gilroy-Light",
      color: "#ffffff",
      fontSize: 16,
    },
  });