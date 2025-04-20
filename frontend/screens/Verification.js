import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";

export default function Verification({ navigation }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20);

  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>
        We've sent the verification code to your email.
      </Text>

      {/* Code Inputs */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Send Button */}
      <TouchableOpacity style={styles.sendBtn}>
        <Text style={styles.sendText}>SEND</Text>
        <Text style={styles.arrow}>➝</Text>
      </TouchableOpacity>

      {/* Resend */}
      <Text style={styles.resendText}>
        Re-send code in <Text style={styles.timer}>{`0:${timer < 10 ? `0${timer}` : timer}`}</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  arrow: {
    color: "#fff",
    fontSize: 18,
  },
  backArrow: {
    alignSelf: "flex-start",
    marginTop: 30,
    marginBottom: -10,
  },
  backArrowText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  codeInput: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Gilroy-Regular",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  resendText: {
    marginTop: 20,
    color: "#555",
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
  },
  sendBtn: {
    backgroundColor: "#4f6df5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    width: "100%",
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
    marginRight: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    alignSelf: "flex-start",
    marginBottom: 30,
    lineHeight: 20,
    fontFamily: "Gilroy-Regular",
  },
  timer: {
    color: "#4f6df5",
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontFamily: "Gilroy-ExtraBold",
    alignSelf: "flex-start",
    marginTop: 40,
    marginBottom: 8,
  },
});