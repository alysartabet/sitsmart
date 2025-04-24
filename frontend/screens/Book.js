import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Book({ route, navigation }) {
  const { roomId, roomNum, building, capacity } = route.params;

  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const timeOptions = [
    "8:00 AM - 9:30 AM",
    "10:00 AM - 11:30 AM",
    "12:00 PM - 1:30 PM",
    "2:00 PM - 3:30 PM",
    "4:00 PM - 5:30 PM",
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const openDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Room Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/location.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Room Type</Text>
            <Text style={styles.value}>Lab</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/capacity.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Capacity</Text>
            <Text style={styles.value}>{capacity}</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/computer.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Computers</Text>
            <Text style={styles.value}>25</Text>
          </View>
          <View style={styles.row}>
            <Image
              source={require("../assets/images/whiteboard.png")}
              style={styles.icon}
            />
            <Text style={styles.label}>Whiteboards</Text>
            <Text style={styles.value}>2</Text>
          </View>
        </View>

        {/* Booking Form */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select Date</Text>
          <DateTimePicker
            isVisible={isDatePickerVisible}
            value={date}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onCancel={hideDatePicker}
            onConfirm={handleConfirm}
          />

          <Text style={styles.inputLabel}>Select Time Slot</Text>
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => setShowTimeOptions(!showTimeOptions)}
          >
            <Text style={styles.inputText}>{timeSlot}</Text>
          </TouchableOpacity>

          {showTimeOptions &&
            timeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setTimeSlot(option);
                  setShowTimeOptions(false);
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

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
        onPress={() => {
          // TODO: Handle booking logic here
          alert("Room booked successfully!");
          navigation.goBack();
        }}
      >
        <Text style={styles.confirmText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 24,
    paddingBottom: 100,
  },
  detailsContainer: {
    marginBottom: 32,
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
