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
            <Image source={require("../assets/images/home.png")} style={styles.navTouch} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Image source={require("../assets/images/search.png")} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
            <Image source={require("../assets/images/calendar.png")} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Image source={require("../assets/images/bell.png")} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    marginTop: 10,
    overflow: "hidden",
  },
  bookingDetails: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "flex-start",
    gap: 20,
  },
  bookingText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  bulbIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 14,
    marginLeft: -10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 40,
    fontFamily: "Gilroy-ExtraBold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,

  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#fff",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginBottom: 18,
  },
  navTouch: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginBottom: 18,
    tintColor: "#1e90ff",
  },
  profileIcon: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginTop: 4,
    marginLeft: 10,
    
  },
  roomImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  sectionTitle: {
    marginTop: 35,
    fontSize: 20,
    fontFamily: "Gilroy-Regular",
  },
  sessionContainer: {
    backgroundColor: "#e9f1fb",
    borderRadius: 16,
    marginTop: 15,
    padding: 45,
  },
  sessionLabel: {
    fontSize: 17,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    textAlign: "left",
    position: "absolute",
    top: 20,
    left: 35,
  },
  timerIcon: {
    position: "absolute",
    right: 20,
    top: -40,
    width: 110,
    height: 110,
    resizeMode: "contain",
  },
  timerText: {
    fontSize: 23,
    fontFamily: "Gilroy-ExtraBold",
    color: "#243a78",
    position: "absolute",
    right: 48,
    top: 0,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 8,
  },
  tipText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
    flex: 1,
    color: "#333",
    lineHeight: 20,
  },
});