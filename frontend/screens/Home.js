import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, John</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image source={require("../assets/images/profileplaceholder.png")} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>

      {/* Recent Booking */}
      <Text style={styles.sectionTitle}>Recent Booking</Text>
      <View style={styles.bookingCard}>
        <Image source={require("../assets/images/room.png")} style={styles.roomImage} />
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingText}>Room 723</Text>
          <Text style={styles.bookingText}>Capacity: 20</Text>
        </View>
      </View>

      {/* Session Timer */}
      <Text style={styles.sectionTitle}>Session in Progress</Text>
      <View style={styles.sessionContainer}>
        <Text style={styles.sessionLabel}>Your time will end in:</Text>
        <Image source={require("../assets/images/countdowncircle.png")} style={styles.timerIcon} />
        <Text style={styles.timerText}>42:17</Text>
      </View>

      {/* Tip of the Day */}
      <Text style={styles.sectionTitle}>Tip of the Day</Text>
      <View style={styles.tipContainer}>
        <Image source={require("../assets/images/bulb.png")} style={styles.bulbIcon} />
        <Text style={styles.tipText}>Book rooms in advance to secure your favorite spot</Text>
      </View>

      {/* Bottom Navigation Bar (static mockup for now) */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image source={require("../assets/images/homeblue.png")} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Image source={require("../assets/images/searchblack.png")} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
            <Image source={require("../assets/images/calendarblack.png")} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Image source={require("../assets/images/bellblack.png")} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
  },
  bookingDetails: {
    padding: 12,
  },
  bookingText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  bulbIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "Gilroy-ExtraBold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  profileIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  roomImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontFamily: "Gilroy-ExtraBold",
  },
  sessionContainer: {
    backgroundColor: "#e9f1fb",
    borderRadius: 16,
    marginTop: 8,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  sessionLabel: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginBottom: 10,
    color: "#333",
  },
  timerIcon: {
    position: "absolute",
    right: 30,
    top: 25,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  timerText: {
    fontSize: 24,
    fontFamily: "Gilroy-ExtraBold",
    color: "#243a78",
    position: "absolute",
    right: 55,
    top: 55,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    flex: 1,
    color: "#333",
  },
});