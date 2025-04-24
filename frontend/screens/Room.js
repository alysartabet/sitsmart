import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Room({ navigation, route }) {
  const { roomId } = route.params;
  const [roomDetails, setRoomDetails] = useState(null);

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require("../assets/images/room.png")}
          style={styles.roomImage}
        />
        <Text style={styles.roomTitle}>Room {roomDetails.room_num}</Text>
        <Text style={styles.meta}>Building: {roomDetails.building_id}</Text>
        <Text style={styles.meta}>Room Type: {roomDetails.room_type}</Text>
        <Text style={styles.meta}>Capacity: {roomDetails.room_capacity}</Text>
        <Text style={styles.meta}>Computers: {roomDetails.num_computers}</Text>
        <Text style={styles.meta}>
          Whiteboards: {roomDetails.num_whiteboards}
        </Text>
      </ScrollView>

      {/* Bottom Booking Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate("Book", { roomId })}
      >
        <Text style={styles.bookText}>Book this Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // To make space for bottom button
  },
  loadingText: {
    marginTop: 100,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Gilroy-Regular",
    color: "#888",
  },
  roomImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
    marginBottom: 20,
  },
  roomTitle: {
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    marginBottom: 10,
  },
  meta: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
    marginBottom: 8,
  },
  bookButton: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: "#4f6df5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 6,
  },
  bookText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
  },
});
