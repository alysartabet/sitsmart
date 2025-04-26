import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  Alert,
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

const { width } = Dimensions.get("window");

export default function Notifications({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(data);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkExpired();
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotification = async (notification) => {
    if (notification.type === "booking_confirmation") {
      const confirm = await new Promise((resolve) => {
        Alert.alert(
          "Confirm Booking",
          "Are you sure you want to confirm this booking?",
          [
            { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
            { text: "Confirm", onPress: () => resolve(true) },
          ]
        );
      });

      if (confirm) {
        await supabase
          .from("notifications")
          .update({ status: "confirmed" })
          .eq("id", notification.id);

        fetchNotifications();
      }
    } else if (notification.type === "profile_update") {
      Alert.alert(
        "Complete Your Profile",
        "You need to update your full name and/or student ID.",
        [
          {
            text: "Go to Account Settings",
            onPress: () => navigation.navigate("AcctSettings"),
          },
        ]
      );
    } else if (notification.type === "profile_picture_update") {
      Alert.alert(
        "Upload Your Profile Picture",
        "Go upload a profile picture to personalize your account!",
        [
          {
            text: "Go to Profile",
            onPress: () => navigation.navigate("Profile"),
          },
        ]
      );
    }
  };

  const checkExpired = async () => {
    const now = new Date();
    const updatedNotifications = [];

    for (let n of notifications) {
      const createdAt = parseISO(n.created_at);
      const diffMinutes = (now - createdAt) / (1000 * 60);
      if (diffMinutes > 5) {
        // expire
        await supabase.from("reservations").delete().eq("id", n.reservation_id);

        await supabase
          .from("notifications")
          .update({ status: "expired" })
          .eq("id", n.id);
      } else {
        updatedNotifications.push(n);
      }
    }

    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    const interval = setInterval(checkExpired, 60000); // check every minute
    return () => clearInterval(interval);
  }, [notifications]);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>

      {notifications.length === 0 ? (
        <>
          <Image
            source={require("../assets/images/nonotificationbell.png")}
            style={styles.bell}
          />
          <Text style={styles.message}>NO Notifications</Text>
        </>
      ) : (
        <ScrollView
          style={{ width: "100%", paddingHorizontal: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.card}
              onPress={() => handleNotification(notification)}
            >
              <Text style={styles.cardTitle}>
                {notification.type === "booking_confirmation"
                  ? "Booking Confirmation"
                  : notification.type === "profile_update"
                  ? "Complete Your Profile"
                  : notification.type === "profile_picture_update"
                  ? "Upload Your Profile Picture"
                  : "Notification"}
              </Text>
              <Text style={styles.cardText}>
                {notification.type === "booking_confirmation"
                  ? "Confirm your booking within 5 minutes to keep it!"
                  : notification.type === "profile_update"
                  ? "Please update your account details."
                  : notification.type === "profile_picture_update"
                  ? "Add a profile picture to personalize your account!"
                  : ""}
              </Text>
              <Text style={styles.timeText}>
                {formatDistanceToNowStrict(parseISO(notification.created_at))}{" "}
                ago
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/images/home.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Image
            source={require("../assets/images/search.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
          <Image
            source={require("../assets/images/calendar.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image
            source={require("../assets/images/bell.png")}
            style={styles.navTouch}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  bell: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: "contain",
    marginBottom: 20,
  },
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
});
