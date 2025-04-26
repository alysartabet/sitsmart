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
  const [roomRating, setRoomRating] = useState(null); // for av_rating
  const [ratingsCount, setRatingsCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

      // Fetch room rating from room_rating table
      const { data: ratingData, error: ratingError } = await supabase
        .from("room_rating")
        .select("*")
        .eq("room_id", roomId)
        .single();

      if (ratingError) {
        console.log("No rating yet for this room."); // not an error if none exists
      } else if (ratingData) {
        setRoomRating(ratingData.av_rating);
        setRatingsCount(ratingData.ratings_count);
      }
    };
    fetchData();
  }, [roomId]);

  return (
    <View style={styles.container}>
      {roomDetails ? (
        <>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/room.png")}
              style={styles.roomImage}
            />
            <View style={styles.topOverlay}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.overlay}>
              <Text style={styles.roomTitle}>
                {roomDetails.building_id} {roomDetails.room_num}
              </Text>
              {roomRating !== null && ratingsCount !== null && (
                <Text style={styles.ratingMeta}>
                  🎋 {roomRating.toFixed(1)} / 5 ({ratingsCount}{" "}
                  {ratingsCount === 1 ? "rating" : "ratings"})
                </Text>
              )}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.infoTitle}>Room Type</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoDetail}>{roomDetails.room_type}</Text>
            </View>
            <Text style={styles.infoTitle}>Capacity: </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoDetail}>{roomDetails.room_capacity}</Text>
            </View>
            <Text style={styles.infoTitle}>Computers:</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoDetail}>{roomDetails.num_computers}</Text>
            </View>
            <Text style={styles.infoTitle}>Whiteboards:</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoDetail}>
                {roomDetails.num_whiteboards}
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Booking Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate("Book", { roomId })}
          >
            <Text style={styles.bookText}>Book this Room</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Optional: you can show a loading indicator while waiting
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#666" }}>
            Loading room details...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: 400,
    overflow: "hidden",
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    backgroundColor: "#ccc",
  },
  ratingMeta: {
    fontSize: 16,
    fontFamily: "Gilroy-Medium",
    marginTop: 6,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  roomImage: {
    width: "100%",
    height: 420,
    resizeMode: "cover",
  },
  scrollContent: {
    marginTop: -32,
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  roomTitle: {
    fontSize: 30,
    fontFamily: "Gilroy-Bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoTitle: {
    fontFamily: "Gilroy-SemiBold",
    fontSize: 20,
    color: "#333",
    marginBottom: 6,
  },
  infoContainer: {
    backgroundColor: "rgba(75, 73, 73, 0.1)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 15,
  },
  infoDetail: {
    fontFamily: "Gilroy-SemiBold",
    fontSize: 16,
    color: "rgb(37, 32, 32)",
  },
  meta: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#666",
    marginBottom: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  bookButton: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: "#4f6df5",
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  bookText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Gilroy-SemiBold",
  },
  topOverlay: {
    position: "absolute",
    top: 40,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 12,
  },
});
