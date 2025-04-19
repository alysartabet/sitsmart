import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    // TODO: integrate with backend to trigger password reset
    navigation.navigate("Verification");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>

      {/* Heading */}
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Please enter your email address to request a password reset
      </Text>

      {/* Email Field */}
      <View style={styles.inputWrapper}>
        <Image
          source={require("../assets/images/mail.png")}
          style={styles.icon}
        />
        <TextInput
          placeholder="abc@email.com"
          placeholderTextColor="#888"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendText}>SEND</Text>
        <Text style={styles.arrow}>➝</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 24,
    justifyContent: "flex-start",
  },
  backArrow: {
    position: "absolute",
    top: 60,
    left: 24,
  },
  backArrowText: {
    fontSize: 26,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    marginBottom: 20,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#666",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    width: "100%",
    height: 50,
    marginBottom: 50,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#888",
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
  },
  sendBtn: {
    flexDirection: "row",
    backgroundColor: "#4f6df5",
    paddingVertical: 14,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    width: "100%",
  },
  sendText: {
    color: "#fff",
    fontFamily: "Gilroy-Regular",
    fontSize: 16,
    marginRight: 8,
  },
  arrow: {
    color: "#fff",
    fontSize: 18,
  },
});