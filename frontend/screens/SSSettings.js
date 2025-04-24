import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
} from "react-native";

export default function SSSettings({ navigation }) {
  const [generalNotifications, setGeneralNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { displayMode, setDisplayMode, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backArrowText, { color: theme.text }]}>←</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      {/* General Notifications */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: theme.text }]}>
          General Notifications
        </Text>
        <Switch
          value={generalNotifications}
          onValueChange={setGeneralNotifications}
          trackColor={{ false: "#ccc", true: "#4f6df5" }}
          thumbColor={generalNotifications ? "#fff" : "#f4f3f4"}
          disabled={true}
        />
      </View>

      <View style={styles.divider} />

      {/* Email Notifications */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: theme.text }]}>
          Email Notifications
        </Text>
        <Switch
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          trackColor={{ false: "#ccc", true: "#4f6df5" }}
          thumbColor={emailNotifications ? "#fff" : "#f4f3f4"}
        />
      </View>

      <View style={[styles.divider, { marginBottom: 24 }]} />

      {/* Display Mode */}
      <Text style={[styles.label, { marginBottom: 12 }, { color: theme.text }]}>
        Display Mode
      </Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setDisplayMode("light")}
          style={[
            styles.toggleButton,
            displayMode === "light" && styles.activeToggle,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              displayMode === "light" && styles.activeToggleText,
            ]}
          >
            Light
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDisplayMode("dark")}
          style={[
            styles.toggleButton,
            displayMode === "dark" && styles.activeToggle,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              displayMode === "dark" && styles.activeToggleText,
            ]}
          >
            Dark
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backArrow: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backArrowText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
    fontFamily: "Gilroy-ExtraBold",
  },
  settingItem: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Gilroy-SemiBold",
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    color: "#888",
    fontFamily: "Gilroy-Regular",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    color: "#000",
  },
  activeToggle: {
    backgroundColor: "#4f6df5",
  },
  activeToggleText: {
    color: "#fff",
    fontFamily: "Gilroy-Bold",
  },
});
