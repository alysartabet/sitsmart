import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from "react-native";

const slides = [
  {
    id: "1",
    image: require("../assets/images/onboarding1.png"),
    caption: (
      <>
        <Text style={{ fontFamily: "Gilroy-Regular" }}>Find the </Text>
        <Text style={{ fontFamily: "Gilroy-ExtraBold" }}>right </Text>
        <Text style={{ fontFamily: "Gilroy-Regular" }}>
          classroom or study space —{"\n"}anytime, anywhere!
        </Text>
      </>
    ),
  },
  {
    id: "2",
    image: require("../assets/images/onboarding2.png"),
    caption: (
      <Text style={{ fontFamily: "Gilroy-Regular" }}>
        Built for <Text style={{ fontFamily: "Gilroy-ExtraBold" }}>your</Text> campus flow
      </Text>
    ),
  },
  {
    id: "3",
    image: require("../assets/images/onboarding3.png"),
    caption: (
      <Text style={{ fontFamily: "Gilroy-Regular" }}>
        Level up your <Text style={{ fontFamily: "Gilroy-ExtraBold" }}>productivity</Text>
      </Text>
    ),
  },
];

const { height, width } = Dimensions.get("window");

export default function Onboarding({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.illustration} />
      <Text style={styles.caption}>{item.caption}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topcontainer}>
        <Image source={require("../assets/images/logo-wrapper.png")} style={styles.logo} />
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.bottomcontainer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={index === currentIndex ? styles.dotActive : styles.dot}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Authentication")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    slide: {
      width: width,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      paddingTop: 80,
      alignItems: "center",
      justifyContent: "space-between",
    },
    topcontainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: "center",
      paddingTop: 1,
    },
    midcontainer: {
      flex: 2.5,
      justifyContent: 'flex-start',
      alignItems: "center",
      paddingTop: 20,
    },
    bottomcontainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: "center",
      paddingTop: 1,
      marginBottom: 100,
    },
    logo: {
      width: 200,
      height: 180,
      resizeMode: "contain",
      marginTop: 10,
    },
    body: {
      flex: 4,
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
    },
    illustration: {
      width: width * 0.8,
      height: height * 0.35,
      resizeMode: "contain",
      marginBottom: 0,
      marginTop: 80,
    },
    caption: {
      fontSize: 16,
      fontFamily: "Gilroy-Regular",
      textAlign: "center",
      color: "#333",
      lineHeight: 24,
      marginTop: 0,
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
      paddingHorizontal: 100,
      borderRadius: 12,
    },
    buttonText: {
      fontFamily: "Gilroy-Light",
      color: "#ffffff",
      fontSize: 16,
    },
  });