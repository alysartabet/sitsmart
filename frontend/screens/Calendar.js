import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  format,
  startOfWeek,
  addDays,
  parseISO,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  PanResponder,
} from "react-native";
import { useRoute } from "@react-navigation/native";

export default function Calendar({ navigation }) {
  const route = useRoute();
  const passedDate = route.params?.selectedDate;
  const [reservations, setReservations] = useState([]);

  const today = passedDate ? parseISO(passedDate) : new Date();
  const [currentStartOfWeek, setCurrentStartOfWeek] = useState(
    startOfWeek(today, { weekStartsOn: 0 })
  );

  const handleCancelReservation = (reservationId) => {
    // Ask confirmation
    alertConfirm(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation?",
      async () => {
        const { error } = await supabase
          .from("reservations")
          .delete()
          .eq("id", reservationId);

        if (error) {
          console.error("Error cancelling reservation:", error);
          alert("Failed to cancel reservation. Please try again.");
        } else {
          // Refetch reservations after successful delete
          const { data: updatedData, error: fetchError } = await supabase
            .from("reservations")
            .select("*");

          if (fetchError) {
            console.error("Error fetching updated reservations:", fetchError);
          } else {
            setReservations(updatedData);
          }
        }
      }
    );
  };

  useEffect(() => {
    const fetchReservations = async () => {
      const { data, error } = await supabase.from("reservations").select("*");

      if (error) {
        console.error("Error fetching reservations:", error);
      } else {
        setReservations(data);
      }
    };

    fetchReservations();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20; // only respond to horizontal swipes
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        // Swipe right - go to previous week
        setCurrentStartOfWeek((prev) => subWeeks(prev, 1));
      } else if (gestureState.dx < -50) {
        // Swipe left - go to next week
        setCurrentStartOfWeek((prev) => addWeeks(prev, 1));
      }
    },
  });

  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(currentStartOfWeek, index);
    return {
      day: format(date, "E")[0],
      date: format(date, "d"),
      fullDate: format(date, "yyyy-MM-dd"),
    };
  });

  const reservationsForSelectedDate = reservations.filter(
    (r) => r.date === selectedDate
  );

  const TimeScheduleWithKoala = () => (
    <View style={styles.timeGrid}>
      {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => (
        <View key={hour} style={styles.timeRow}>
          <Text style={styles.timeLabel}>{formatHour(hour)}</Text>
          <View style={styles.line} />
        </View>
      ))}
      <Image
        source={require("../assets/images/lazykoala.png")}
        style={styles.lazyKoala}
      />
    </View>
  );

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

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour > 12 ? hour - 12 : hour;
    return `${display} ${suffix}`;
  };

  const alertConfirm = (title, message, onConfirm) => {
    if (window.confirm) {
      // Web
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      // React Native
      Alert.alert(
        title,
        message,
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: onConfirm },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My Reservations</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FullCalendar", {
              initialDate: selectedDate,
            })
          }
        >
          <Image
            source={require("../assets/images/fullcalendar.png")}
            style={styles.calendarIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Calendar Strip */}
      <Text style={styles.dateText}>
        {format(currentStartOfWeek, "MMMM yyyy")}
      </Text>
      <View {...panResponder.panHandlers}>
        <View style={styles.calendarStrip}>
          {days.map((d, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dateItem,
                d.fullDate === selectedDate && styles.activeDate,
              ]}
              onPress={() => setSelectedDate(d.fullDate)}
            >
              <Text
                style={[
                  styles.dayText,
                  d.fullDate === selectedDate && styles.activeDayText,
                ]}
              >
                {d.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  d.fullDate === selectedDate && styles.activeDateText,
                ]}
              >
                {d.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {reservationsForSelectedDate.length > 0 ? (
        <ScrollView
          style={{ marginBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 20 }}>
            {reservationsForSelectedDate.map((res, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.room}>{res.room_id}</Text>
                <Text style={styles.time}>
                  {formatDisplayTime(res.start_time)} -{" "}
                  {formatDisplayTime(res.end_time)}
                </Text>
                <View style={styles.cardButtons}>
                  <TouchableOpacity style={styles.overrideBtn}>
                    <Text style={styles.overrideText}>Rate Room</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelReservation(res.id)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <TimeScheduleWithKoala />
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
            style={styles.navTouch}
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
  calendarIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Gilroy-ExtraBold",
  },
  lazyKoala: {
    position: "absolute",
    top: 60,
    left: "25%",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
    marginLeft: 10,
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
  timeGrid: {
    marginTop: 80,
    position: "relative",
    height: 400,
    justifyContent: "center",
  },
  timeLabel: {
    width: 60,
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
});
