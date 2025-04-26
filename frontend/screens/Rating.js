import React, { useState, useRef } from "react";
import { supabase } from "../SupabaseClient";
import {
  Alert,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Rating({ navigation, route }) {
  const { roomName, roomId } = route.params || {
    roomName: "Room Name",
    roomId: null,
  };
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const lastTapRef = useRef(null);

  const handleRating = (index) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300; // ms

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      setRating(0); // Double tap detected: reset rating
    } else {
      setRating(index + 1); // Single tap: normal rating
    }
    lastTapRef.current = now;
  };

  const handleSave = async () => {
    if (!roomId) {
      console.error("Missing roomId! Cannot save review.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(userError);
      return;
    }

    const user_id = user.id;

    const { error: insertError } = await supabase.from("room_review").insert({
      room_id: roomId,
      user_id: user_id,
      rating: rating,
      review_text: review,
    });

    if (insertError) {
      console.error(insertError);
      return;
    }

    const { data: session } = await supabase.auth.getSession();

    const response = await fetch(
      `https://osldfluzgpxzeuvwfwvu.functions.supabase.co/update-room-rating`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room_id: roomId }),
      }
    );

    const result = await response.json();
    console.log("Function call result:", result);

    if (!response.ok) {
      console.error(
        "Failed to update room_rating:",
        result.error || result.message
      );
      Alert.alert("Error", "Failed to update room rating.");
      return;
    }

    // 🎉 Only show success if everything worked
    Alert.alert(
      "Success!",
      "Your review has been saved.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Calendar"),
        },
      ],
      { cancelable: false }
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Rate Room</Text>

        <View style={styles.card}>
          <Text style={styles.roomName}>{roomName}</Text>
          <View style={styles.divider} />

          <Text style={styles.question}>
            How would you rate your experience of this room overall? Double tap
            to reset!
          </Text>

          <View style={styles.bambooRow}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity key={index} onPress={() => handleRating(index)}>
                <Image
                  source={require("../assets/images/bamboo.png")}
                  style={[styles.bamboo, { opacity: rating > index ? 1 : 0.3 }]}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingText}>{rating}/5</Text>

          <Text style={styles.leaveReview}>Leave a Review</Text>

          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Write about your past experience in the room, give tips to your future self and others!"
            value={review}
            onChangeText={setReview}
            placeholderTextColor="#aaa"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <Image
          style={styles.hangingKoala}
          source={require("../assets/images/hangingkoala.png")}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    alignSelf: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  hangingKoala: {
    width: 180,
    height: 180,
    position: "absolute",
    top: 30,
    right: 20,
    resizeMode: "contain",
  },
  question: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 10,
  },
  bambooRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  bamboo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginHorizontal: -20,
    tintColor: "rgb(84, 183, 143)",
  },
  ratingText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "rgb(31, 73, 49)",
  },
  leaveReview: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
  },
  buttonRow: {
    position: "absolute",
    bottom: 60,
    left: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
  },
  cancelText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
