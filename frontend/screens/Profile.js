import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Profile({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image source={require("../assets/images/bellblack.png")} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>

      {/* Profile Image with Camera Button */}
      <View style={styles.profileContainer}>
        <Image source={require("../assets/images/profile.png")} style={styles.profilePic} />
        <TouchableOpacity style={styles.cameraButton}>
          <Image source={require("../assets/images/camera.png")} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {/* Options List */}
      
      <View style={styles.optionRow}>
      <TouchableOpacity onPress={() => navigation.navigate("AcctSettings")}>
        <Image source={require("../assets/images/profile.png")} style={styles.optionIcon} />
        </TouchableOpacity>
        <Text style={styles.optionText}>Account Details</Text>
      </View>
      

      <View style={styles.optionRow}>
       <TouchableOpacity onPress={() => navigation.navigate("FAQ")}>
            <Image source={require("../assets/images/bulb.png")} style={styles.optionIcon} />
        </TouchableOpacity>
        <Text style={styles.optionText}>Help</Text>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SSSettings")}>
        <Image source={require("../assets/images/logo.png")} style={styles.optionIcon} />
        </TouchableOpacity>
        <Text style={styles.optionText}>SitSmart Settings</Text>
      </View>

      <View style={styles.optionRow}>
       <TouchableOpacity onPress={() => navigation.navigate("Splash")}>
          <Image source={require("../assets/images/logout.png")} style={styles.optionIcon} />
        </TouchableOpacity>
        <Text style={styles.optionText}>Log Out</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },
  bellIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "cover",
    marginBottom: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4f6df5",
    borderRadius: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    width: 14,
    height: 14,
    tintColor: "#fff",
    resizeMode: "contain",
  },
  name: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
    fontFamily: "Gilroy-Regular",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 16,
    resizeMode: "contain",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
});