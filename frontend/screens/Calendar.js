import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

export default function Calendar({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("17");

  const days = [
    { day: "S", date: "13" },
    { day: "M", date: "14" },
    { day: "T", date: "15" },
    { day: "W", date: "16" },
    { day: "T", date: "17" },
    { day: "F", date: "18" },
    { day: "S", date: "19" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Reservations</Text>

      {/* Calendar Strip */}
      <View style={styles.calendarStrip}>
        {days.map((d, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.dateItem,
              d.date === selectedDate && styles.activeDate,
            ]}
            onPress={() => setSelectedDate(d.date)}
          >
            <Text
              style={[
                styles.dayText,
                d.date === selectedDate && styles.activeDayText,
              ]}
            >
              {d.day}
            </Text>
            <Text
              style={[
                styles.dateText,
                d.date === selectedDate && styles.activeDateText,
              ]}
            >
              {d.date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reservation Card */}
      <View style={styles.card}>
        <Text style={styles.room}>Room 101</Text>
        <Text style={styles.building}>Building 16w</Text>
        <Text style={styles.time}>2:00 PM - 3:00 PM</Text>
        <View style={styles.cardButtons}>
          <TouchableOpacity style={styles.overrideBtn}>
            <Text style={styles.overrideText}>Override</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Bar (static mockup for now) */}
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image source={require("../assets/images/home.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Image source={require("../assets/images/search.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
                <Image source={require("../assets/images/calendar.png")} style={styles.navTouch} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Image source={require("../assets/images/bell.png")} style={styles.navIcon} />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeDate: {
    backgroundColor: "#4f6df5",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeDateText: {
    color: "#fff",
  },
  activeDayText: {
    color: "#fff",
  },
  building: {
    color: "#555",
    marginBottom: 10,
    fontFamily: "Gilroy-Regular",
  },
  calendarStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  cancelBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    paddingTop: 70,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  dateItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Gilroy-Bold",
  },
  dayText: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Gilroy-Regular",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Gilroy-ExtraBold",
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
  overrideBtn: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  overrideText: {
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  room: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Gilroy-ExtraBold",
  },
  time: {
    fontSize: 16,
    fontFamily: "Gilroy-Medium",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    marginBottom: 10,
  },
});