import React from "react";
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

const roomData = [
  {
    id: "1",
    name: "Room 821",
    location: "16. 61ws.st",
    capacity: 31,
    image: require("../assets/images/room.png"),
  },
  {
    id: "2",
    name: "Room 103",
    location: "8. Hudson Ave",
    capacity: 24,
    image: require("../assets/images/room.png"), // Replace with a different image if needed
  },
];

export default function Search({navigation}) {
  const renderRoomCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.roomImage} />
      <View style={styles.cardContent}>
        <Text style={styles.roomName}>{item.name}</Text>
        <View style={styles.row}>
          <Image
            source={require("../assets/images/searchblack.png")}
            style={styles.icon}
          />
          <Text style={styles.meta}>{item.location}</Text>
        </View>
        <Text style={styles.meta}>Capacity: {item.capacity}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookText}>BOOK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image
          source={require("../assets/images/searchblack.png")}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      {/* Room Cards */}
      <FlatList
        data={roomData}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomCard}
        contentContainerStyle={styles.roomList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation Bar (static mockup for now) */}
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image source={require("../assets/images/homeblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Image source={require("../assets/images/searchblue.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
                <Image source={require("../assets/images/calendarblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Image source={require("../assets/images/bellblack.png")} style={styles.navIcon} />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingTop: 60,
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
    roomList: {
      paddingBottom: 20,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#eee",
    },
    roomImage: {
      width: "100%",
      height: 140,
      resizeMode: "cover",
    },
    cardContent: {
      padding: 12,
      position: "relative",
    },
    roomName: {
      fontSize: 16,
      fontFamily: "Gilroy-SemiBold",
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    icon: {
      width: 14,
      height: 14,
      tintColor: "#555",
      marginRight: 4,
    },
    meta: {
      fontSize: 13,
      color: "#555",
      fontFamily: "Gilroy-Regular",
    },
    bookButton: {
      backgroundColor: "#4f6df5",
      position: "absolute",
      top: 12,
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
    navbar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "#fff",
        borderTopColor: "#eee",
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 10,
      },
      navIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
      },
  });