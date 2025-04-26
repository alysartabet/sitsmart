import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  PanResponder,
} from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from({ length: 2040 - 2022 + 1 }, (_, i) => 2022 + i);

export default function FullCalendar({ navigation }) {
  const route = useRoute();
  const passedInitialDate = route.params?.initialDate;

  const [currentDate, setCurrentDate] = useState(
    passedInitialDate ? parseISO(passedInitialDate) : new Date()
  );
  const [calendarDays, setCalendarDays] = useState([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  const generateCalendar = (date) => {
    const startMonth = startOfMonth(date);
    const endMonth = endOfMonth(date);
    const start = startOfWeek(startMonth, { weekStartsOn: 0 });
    const end = endOfWeek(endMonth, { weekStartsOn: 0 });

    const days = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    setCalendarDays(days);
  };

  const handleMonthChange = (direction) => {
    const newDate =
      direction === "next"
        ? addMonths(currentDate, 1)
        : subMonths(currentDate, 1);
    setCurrentDate(newDate);
  };

  const handleDatePress = (date) => {
    navigation.navigate("Calendar", {
      selectedDate: format(date, "yyyy-MM-dd"),
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        // Swipe right → previous month
        setCurrentDate((prev) => subMonths(prev, 1));
      } else if (gestureState.dx < -50) {
        // Swipe left → next month
        setCurrentDate((prev) => addMonths(prev, 1));
      }
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Full Calendar</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.monthLabel}>{format(currentDate, "MMMM")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowYearPicker(true)}>
          <Text style={styles.yearLabel}>{format(currentDate, "yyyy")}</Text>
        </TouchableOpacity>
      </View>

      <View {...panResponder.panHandlers}>
        {/* Weekday Labels */}
        <View style={styles.weekRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
            <Text key={idx} style={styles.weekday}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.grid}>
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const today = isToday(day);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  today && styles.todayCell,
                  !isCurrentMonth && styles.faded,
                ]}
                onPress={() => handleDatePress(day)}
              >
                <Text style={[styles.dayText, today && styles.todayText]}>
                  {format(day, "d")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showMonthPicker && (
          <View style={styles.pickerModal}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={month}
                onPress={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(index);
                  setCurrentDate(newDate);
                  setShowMonthPicker(false);
                }}
              >
                <Text style={styles.pickerItem}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showYearPicker && (
          <View style={styles.pickerModal}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(year);
                  setCurrentDate(newDate);
                  setShowYearPicker(false);
                }}
              >
                <Text style={styles.pickerItem}>{year.toString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
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

const cellSize = (width - 48) / 7;

const styles = StyleSheet.create({
  arrow: {
    fontSize: 24,
    fontWeight: "600",
  },
  back: {
    fontSize: 24,
    paddingRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  dayCell: {
    width: cellSize,
    height: cellSize,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
  },
  faded: {
    opacity: 0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthItem: {
    marginRight: 12,
    fontSize: 16,
    color: "#888",
    fontFamily: "Gilroy-Regular",
  },
  monthLabel: {
    fontSize: 20,
    fontFamily: "Gilroy-Bold",
    marginRight: 8,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
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
  pickerItem: {
    paddingVertical: 8,
    fontSize: 18,
    fontFamily: "Gilroy-Regular",
    textAlign: "center",
  },
  pickerModal: {
    position: "absolute",
    top: 120,
    left: 24,
    right: 24,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    zIndex: 1000,
  },
  selected: {
    color: "#4f6df5",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    textAlign: "center",
  },
  todayCell: {
    backgroundColor: "#4f6df5",
    borderRadius: 50,
  },
  todayText: {
    color: "#fff",
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  weekday: {
    width: cellSize,
    textAlign: "center",
    fontFamily: "Gilroy-Bold",
    color: "#555",
  },
  yearItem: {
    marginRight: 12,
    fontSize: 16,
    color: "#888",
    fontFamily: "Gilroy-Regular",
  },
  yearLabel: {
    fontSize: 20,
    fontFamily: "Gilroy-Regular",
  },
});
