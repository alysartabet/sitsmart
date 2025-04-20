import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function Notifications({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>

      <Image
        source={require("../assets/images/nonotificationbell.png")}
        style={styles.bell}
      />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>0</Text>
      </View>

      <Text style={styles.message}>NO Notifications</Text>

      {/* Bottom Navigation Bar (static mockup for now) */}
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image source={require("../assets/images/homeblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Image source={require("../assets/images/searchblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
                <Image source={require("../assets/images/calendarblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Image source={require("../assets/images/bellblue.png")} style={styles.navIcon} />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  heading: {
    fontSize: 24,
    fontFamily: "Gilroy-ExtraBold",
    marginBottom: 40,
  },
  bell: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#4f6df5",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 180,
    right: width / 2 - 70,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginTop: 10,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});