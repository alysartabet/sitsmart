import React, { useState } from "react";
import { supabase } from "../SupabaseClient";
import { SUPABASE_ANON_KEY } from "../SupabaseClient";
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

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSend = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", cleanedEmail)
    .single();

    if (error || !data) {
      alert("Email not found.");
      return;
    }

    const code = generateCode();

    // Store in DB
    const { error: insertError } = await supabase
      .from("reset_codes")
      .insert([{ email, code }]);

    if (insertError) {
      alert("Failed to create reset code.");
      return;
    }

    // Call Edge Function
    try{
      const response = await fetch("https://osldfluzgpxzeuvwfwvu.functions.supabase.co/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
         },
        body: JSON.stringify({ to: cleanedEmail, code })
      });
  
      const contentType = response.headers.get("content-type");

      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();  
      }
      
      try {
        if (!response.ok) {
          alert("Failed to send reset code email.");
          return;
        }
    
        alert("Verification code sent to your email.");
        navigation.navigate("Verification", { email: cleanedEmail });
      } catch (err) {
        console.error("Navigation error:", err);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong sending the email.");
    }
    
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
          placeholder="abc@schoolemail.edu"
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
  arrow: {
    color: "#fff",
    fontSize: 18,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 24,
    justifyContent: "flex-start",
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
  subtitle: {
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
    color: "#666",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: "Gilroy-ExtraBold",
    marginBottom: 20,
    color: "#000",
  },
});