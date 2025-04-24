import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Home({ navigation }) {
  const [userName, setUserName] = useState("");
  const [tipOfDay, setTipOfDay] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      const uri = await AsyncStorage.getItem("userProfileImage");
      if (uri) setProfileImage(uri);
    };
    loadProfileImage();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return;
      }

      const userId = session?.user?.id;
      if (!userId) {
        console.warn("No user session found.");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.full_name) {
        const firstName = data.full_name.split(" ")[0];
        setUserName(firstName);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchTipOfDay = async () => {
      const today = new Date().toISOString().split("T")[0]; // e.g., "2025-04-21"

      // Fetch all tips
      const { data: tips, error } = await supabase.from("tips").select("*");

      if (error) {
        console.error("Error fetching tips:", error);
        return;
      }

      if (tips?.length > 0) {
        // Generate a consistent index based on date
        const hash = [...today].reduce(
          (acc, char) => acc + char.charCodeAt(0),
          0
        );
        const index = hash % tips.length;

        setTipOfDay(tips[index].tip_text);
      }
    };

    fetchTipOfDay();
  }, []);

  useEffect(() => {
    const checkForReservation = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Placeholder logic – replace with real reservation table later

      if (data?.length > 0) {
        setHasReservation(true); // Show placeholder reservation
      } else {
        setHasReservation(false); // Show lazy koala
      }
    };

    checkForReservation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {userName ? `Hello, ${userName}` : "Hello!"}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/images/profileplaceholder.png")
            }
            style={[styles.profileIcon, { borderRadius: 30 }]} // Make it round-ish
          />
        </TouchableOpacity>
      </View>

      {hasReservation ? (
        <>
          <Text style={styles.sectionTitle}>Recent Booking</Text>
          <View style={styles.bookingCard}>
            <Image
              source={require("../assets/images/room.png")}
              style={styles.roomImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.bookingText}>Room 723</Text>
              <Text style={styles.bookingText}>Capacity: 20</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Session in Progress</Text>
          <View style={styles.sessionContainer}>
            <Text style={styles.sessionLabel}>Your time will end in:</Text>
            <Image
              source={require("../assets/images/countdowncircle.png")}
              style={styles.timerIcon}
            />
            <Text style={styles.timerText}>42:17</Text>
          </View>
        </>
      ) : (
        <View style={{ alignItems: "center", marginVertical: 30 }}>
          <Image
            source={require("../assets/images/lazykoala.png")}
            style={{
              width: 180,
              height: 180,
              resizeMode: "contain",
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontFamily: "Gilroy-Regular",
              fontSize: 16,
              color: "#666",
            }}
          >
            No bookings right now. Koala vibes only 🐨💤
          </Text>
        </View>
      )}

      {/* Tip of the Day */}
      <Text style={styles.sectionTitle}>Tip of the Day</Text>
      <View style={styles.tipContainer}>
        <Image
          source={require("../assets/images/bulb.png")}
          style={styles.bulbIcon}
        />
        <Text style={styles.tipText}>
          {tipOfDay ? tipOfDay : "Loading tip..."}
        </Text>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/images/home.png")}
            style={styles.navTouch}
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
            style={styles.navIcon}
          />
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
