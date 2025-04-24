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
} from "react-native";

const { width } = Dimensions.get("window");

export default function Search({ navigation, route }) {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("room")
        .select("room_id, building_id, room_num, room_capacity");

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data);
        setFilteredRooms(data);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = rooms.filter((room) => {
      return (
        room.room_num.toString().includes(query) ||
        room.building_id.toLowerCase().includes(query) ||
        room.room_capacity.toString().includes(query)
      );
    });

    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

  const renderRoomCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Room", { roomId: item.room_id })}
    >
      <Image
        source={require("../assets/images/room.png")}
        style={styles.roomImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.roomName}>Room {item.room_num}</Text>
        <View style={styles.row}>
          <Image
            source={require("../assets/images/location.png")}
            style={styles.icon}
          />
          <Text style={styles.meta}>{item.building_id}</Text>
          <Text style={styles.meta}>Capacity: {item.room_capacity}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate("Book", { roomId: item.room_id })}
        >
          <Text style={styles.bookText}>BOOK</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image
          source={require("../assets/images/search.png")}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Room Cards */}
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={renderRoomCard}
        contentContainerStyle={styles.roomList}
        showsVerticalScrollIndicator={false}
      />

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
            style={styles.navTouch}
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
  bookButton: {
    backgroundColor: "#4f6df5",
    position: "absolute",
    bottom: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  bookText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Gilroy-SemiBold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardContent: {
    padding: 12,
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: "#555",
    marginRight: -5,
    resizeMode: "contain",
  },
  meta: {
    flexDirection: "row",
    fontSize: 13,
    color: "#555",
    fontFamily: "Gilroy-Regular",
    paddingHorizontal: 10,
    paddingTop: 6,
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
  roomImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  roomList: {
    paddingBottom: 20,
  },
  roomName: {
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#888",
    marginRight: 8,
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
  },
});
