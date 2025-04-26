import React, { useState, useEffect, useContext } from "react";
import { supabase } from "../SupabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationsContext } from "../NotificationsContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  RefreshControl,
} from "react-native";

const { width } = Dimensions.get("window");
let countdownIntervalId = null;

export default function Home({ navigation }) {
  const [userName, setUserName] = useState("");
  const [tipOfDay, setTipOfDay] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [upcomingReservation, setUpcomingReservation] = useState(null);
  const [inProgressReservation, setInProgressReservation] = useState(null);
  const sessionEndedOpacity = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);

  const { notifications, fetchNotifications } =
    useContext(NotificationsContext);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      checkForReservation(),
      fetchTipOfDay(), // optional
    ]);
    setRefreshing(false);
  };

  const formatDisplayTime = (timeString) => {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(":");
    const dateObj = new Date();
    dateObj.setHours(parseInt(hour));
    dateObj.setMinutes(parseInt(minute));
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const checkForReservation = async () => {
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId); // clear any previous countdown
      countdownIntervalId = null;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user?.id) {
      console.error("Session error or no user:", sessionError);
      return;
    }

    const userId = session.user.id;

    const { data: reservations, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false }) // newest reservation first
      .order("start_time", { ascending: false }); // newest time first too

    if (error) {
      console.error("Error fetching reservations:", error);
      return;
    }

    const now = new Date();
    const nextReservation = reservations.find((r) => {
      const startDateTime = new Date(`${r.date}T${r.start_time}`);
      const endDateTime = new Date(`${r.date}T${r.end_time}`);
      return endDateTime > now; // any booking whose end is still in the future
    });

    if (nextReservation) {
      setUpcomingReservation(nextReservation);

      const startDateTime = new Date(
        `${nextReservation.date}T${nextReservation.start_time}`
      );
      const endDateTime = new Date(
        `${nextReservation.date}T${nextReservation.end_time}`
      );

      if (startDateTime <= now && endDateTime > now) {
        // Session is IN PROGRESS
        setInProgressReservation(nextReservation);

        countdownIntervalId = setInterval(() => {
          const now = new Date();
          const endDateTime = new Date(
            `${nextReservation.date}T${nextReservation.end_time}`
          );
          const diff = Math.max(0, (endDateTime - now) / 1000);

          const minutes = Math.floor(diff / 60);
          const seconds = Math.floor(diff % 60);

          setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);

          if (diff <= 0) {
            clearInterval(countdownIntervalId);
            countdownIntervalId = null; // reset
            setTimeLeft("Session Ended");
            Animated.timing(sessionEndedOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start();
            setTimeout(() => {
              setInProgressReservation(null);
            }, 3000);
          }
        }, 1000);
      } else {
        // Not started yet
        setInProgressReservation(null);
      }
    } else {
      setUpcomingReservation(null);
      setInProgressReservation(null);
    }
  };

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
    checkForReservation();
    const intervalId = setInterval(() => {
      checkForReservation();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }} // important
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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

        {upcomingReservation ? (
          <>
            <Text style={styles.sectionTitle}>Recent Booking</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
              <View style={styles.bookingCard}>
                <Image
                  source={require("../assets/images/room.png")}
                  style={styles.roomImage}
                />
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingText}>
                    {upcomingReservation.room_id}
                  </Text>
                  <Text style={styles.bookingText}>
                    {formatDisplayTime(upcomingReservation.start_time)} -{" "}
                    {formatDisplayTime(upcomingReservation.end_time)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {inProgressReservation && (
              <>
                <Text style={styles.sectionTitle}>Session in Progress</Text>
                <View style={styles.sessionContainer}>
                  {timeLeft !== "Session Ended" && (
                    <>
                      <Text style={styles.sessionLabel}>
                        Your time will end in:
                      </Text>
                      <Image
                        source={require("../assets/images/countdowncircle.png")}
                        style={styles.timerIcon}
                      />
                    </>
                  )}
                  {timeLeft === "Session Ended" ? (
                    <Animated.Text
                      style={[
                        styles.timerText,
                        styles.sessionEndedText,
                        { opacity: sessionEndedOpacity },
                      ]}
                    >
                      Session Ended
                    </Animated.Text>
                  ) : (
                    <Text style={styles.timerText}>{timeLeft}</Text>
                  )}
                </View>
              </>
            )}
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
      </ScrollView>

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
          {notifications.length > 0 && <View style={styles.badgeDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeDot: {
    width: 10,
    height: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    position: "absolute",
    top: 0,
    right: 0,
  },
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
  sessionEndedText: {
    position: "relative",
    top: 0,
    right: 0,
    alignSelf: "center",
    textAlign: "center",
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
    right: 50,
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
