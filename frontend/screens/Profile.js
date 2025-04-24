import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const STORAGE_KEY = "userProfileImage";

export default function Profile({ navigation }) {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    const uri = await AsyncStorage.getItem(STORAGE_KEY);
    if (uri) setProfileImage(uri);
  };

  const saveProfileImage = async (uri) => {
    setProfileImage(uri);
    await AsyncStorage.setItem(STORAGE_KEY, uri);
  };

  const removeProfileImage = async () => {
    setProfileImage(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const pickImage = async (source) => {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required!");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      await saveProfileImage(result.assets[0].uri);
    }
  };

  const chooseImageSource = () => {
    const options = [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
    ];

    if (profileImage) {
      options.push({
        text: "Remove Photo",
        onPress: handleRemoveImage,
        style: "destructive",
      });
    }

    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Choose Photo", "Upload from:", options);
  };

  const handleRemoveImage = () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: removeProfileImage },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image
            source={require("../assets/images/bell.png")}
            style={styles.bellIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Image with Camera Button */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/images/profileplaceholder.png")
          }
          style={styles.profilePic}
        />
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={chooseImageSource}
        >
          <Image
            source={require("../assets/images/camera.png")}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Options List */}

      <View style={styles.optionRow}>
        <TouchableOpacity onPress={() => navigation.navigate("AcctSettings")}>
          <Image
            source={require("../assets/images/account.png")}
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <Text style={styles.optionText}>Account Details</Text>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity onPress={() => navigation.navigate("FAQ")}>
          <Image
            source={require("../assets/images/help.png")}
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <Text style={styles.optionText}>Help</Text>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity onPress={() => navigation.navigate("SSSettings")}>
          <Image
            source={require("../assets/images/settings.png")}
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <Text style={styles.optionText}>SitSmart Settings</Text>
      </View>

      <View style={styles.optionRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Splash")}>
          <Image
            source={require("../assets/images/logout.png")}
            style={styles.optionIcon}
          />
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
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    overflow: "hidden",
    resizeMode: "cover",
    marginBottom: 10,
  },
  cameraButton: {
    position: "absolute",
    bottom: 40,
    right: 30,
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
