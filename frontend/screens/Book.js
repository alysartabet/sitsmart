import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Book({ navigation, route }) {
  const { roomId } = route.params;
  const [roomDetails, setRoomDetails] = useState(null);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [notes, setNotes] = useState("");
  const now = new Date();
  const minimumStartTime = new Date(now.getTime() + 10 * 60000);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const { data, error } = await supabase
        .from("room")
        .select("*")
        .eq("room_id", roomId)
        .single();

      if (error) {
        console.error("Error fetching room details:", error);
      } else {
        setRoomDetails(data);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (!roomDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading room details...</Text>
      </View>
    );
  }

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmBooking = async () => {
    if (!date || !startTime || !endTime) {
      alert("Please select a date and time range before booking!");
      return;
    }

    const startDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );

    const endDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    );

    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    if (durationMs < 30 * 60 * 1000) {
      alert("Reservation must be at least 30 minutes long.");
      return;
    }
    if (durationMs > 2 * 60 * 60 * 1000) {
      alert("Reservation cannot be longer than 2 hours.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedStartTime = startTime.toLocaleTimeString("en-US", {
      hour12: false,
    });
    const formattedEndTime = endTime.toLocaleTimeString("en-US", {
      hour12: false,
    });

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      alert("You must be logged in to book a room.");
      return;
    }

    const userId = userData.user.id;

    // Check for overlapping reservations
    const { data: overlappingReservations, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("room_id", roomId)
      .eq("date", formattedDate)
      .or(
        `and(start_time.lt.${formattedEndTime},end_time.gt.${formattedStartTime})`
      );

    if (error) {
      console.error("Error checking reservations:", error);
      alert("Could not check availability. Please try again.");
      return;
    }

    if (overlappingReservations.length > 0) {
      alert("Sorry, this room is already booked during that time.");
      return;
    }

    // Insert reservation
    const { data: newReservation, error: insertError } = await supabase
      .from("reservations")
      .insert([
        {
          user_id: userId,
          room_id: roomId,
          date: formattedDate,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          notes: notes,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating reservation:", insertError);
      alert("Something went wrong booking the room.");
      return;
    }

    // Insert notification
    await supabase.from("notifications").insert([
      {
        user_id: userId,
        reservation_id: newReservation.id,
        type: "booking_confirmation",
        status: "pending",
      },
    ]);
    Alert.alert(
      "Booking Created",
      "Please confirm your booking within the next 5 minutes!",
      [
        {
          text: "Confirm Booking",
          onPress: () => navigation.navigate("Notifications"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backArrow}
      >
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Room Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/location.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Room Type</Text>
            <Text style={styles.value}>{roomDetails.room_type}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/capacity.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Capacity</Text>
            <Text style={styles.value}>{roomDetails.room_capacity}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/computer.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Computers</Text>
            <Text style={styles.value}>{roomDetails.num_computers}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/whiteboard.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Whiteboards</Text>
            <Text style={styles.value}>{roomDetails.num_whiteboards}</Text>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select Date</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          {/* Show DateTimePicker */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          {/* Select Start Time */}
          <Text style={styles.inputLabel}>Select Start Time</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.inputText}>{formatTime(startTime)}</Text>
          </TouchableOpacity>

          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime) {
                  const now = new Date();
                  const minimumStartTime = new Date(now.getTime() + 10 * 60000); // now + 10 min
                  const selectedWithTodayDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                  );

                  if (selectedWithTodayDate < minimumStartTime) {
                    alert(
                      "Please select a start time at least 10 minutes from now."
                    );
                    return;
                  }
                  setStartTime(selectedTime);
                }
              }}
            />
          )}

          {/* Select End Time */}
          <Text style={styles.inputLabel}>Select End Time</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.inputText}>{formatTime(endTime)}</Text>
          </TouchableOpacity>

          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (selectedTime) {
                  setEndTime(selectedTime);
                }
              }}
            />
          )}

          <Text style={styles.inputLabel}>Additional Notes (optional)</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholder="Enter any special instructions here"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.confirmText}>Request to Book Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 26,
    color: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 24,
    paddingBottom: 100,
  },
  detailsContainer: {
    marginTop: 60,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 12,
    tintColor: "#4f6df5",
  },
  label: {
    fontFamily: "Gilroy-SemiBold",
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  value: {
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#000",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Gilroy-SemiBold",
    marginTop: 20,
    marginBottom: 6,
    color: "#333",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  inputText: {
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#333",
  },
  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    fontFamily: "Gilroy-Regular",
    fontSize: 15,
    color: "#333",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: "#4f6df5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },
});
