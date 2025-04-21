import React, { useState } from "react";
import { supabase } from "../SupabaseClient";
import { SUPABASE_ANON_KEY } from "../SupabaseClient"


import {
  View, Text, StyleSheet, TextInput, Image,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";

export default function ChangePassword({ navigation, route}) {
    const { email } = route.params || {};
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const togglePasswordVisibility = () => setPasswordVisible(prev => !prev);


    const handlePasswordChange = (pass) => {
      setPassword(pass);
    
      if (
        pass.length < 8 ||
        !/[A-Z]/.test(pass) ||
        !/[a-z]/.test(pass) ||
        !/[0-9]/.test(pass) ||
        !/[^A-Za-z0-9]/.test(pass)
      ) {
        setPasswordError("Weak password: 8+ chars, upper/lowercase, number & symbol");
      } else {
        setPasswordError("");
      }
    };

    const handleConfirmPasswordChange = (text) => {
      setConfirmPassword(text);
    
      if (text !== password) {
        setConfirmPasswordError("Passwords don't match");
      } else {
        setConfirmPasswordError("");
      }
    };
   
    const isStrongPassword = (password) => {
      return (
        password.length >= 8 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
      );
    };

    /*const handleChangePassword = () => {
      navigation.navigate("SignIn");
    };*/

    const handleChangePassword = async () => {
      const { email } = route.params || {};
    
      if (!email) {
        alert("Email not provided.");
        return;
      }
    
      if (!isStrongPassword(password)) {
        setPasswordError("Password is too weak.");
        return;
      }
    
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords don't match.");
        return;
      }
    
      try {
        const response = await fetch("https://osldfluzgpxzeuvwfwvu.functions.supabase.co/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 
          },
          body: JSON.stringify({ email, newPassword: password }),
        });
    
        let result;
        try {
          result = await response.json();
        } catch (parseErr) {
          console.error("Failed to parse JSON:", parseErr);
          alert("Something went wrong with the server.");
          return;
        }
        console.log("Password change result:", result);
    
        if (!response.ok) {
          alert(result.message || "Failed to change password.");
          return;
        }
    
        alert("Password changed successfully!");
        navigation.navigate("SignIn");
      } catch (err) {
        console.error("Change password error:", err);
        alert("Something went wrong.");
      }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Change Password</Text>

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/lock.png")} style={styles.icon} />
          <TextInput placeholder="New password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={[styles.input, passwordError ? styles.inputError : null]} onChangeText={handlePasswordChange} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/lock.png")} style={styles.icon} />
          <TextInput placeholder="Confirm password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={[styles.input, confirmPasswordError ? styles.inputError : null]} onChangeText={handleConfirmPasswordChange} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <TouchableOpacity style={styles.signupBtn} onPress={handleChangePassword}>
          <Text style={styles.signupText}>Change Password</Text>
          <Text style={styles.arrow}>➝</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  arrow: { 
    color: "#fff", 
    fontSize: 18 
  },
  backArrow: {
    position: "absolute",
    top: 60,
    left: 0,
  },
  backArrowText: {
    fontSize: 26,
    color: "#333",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "center",
    paddingTop: 100, 
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    fontSize: 12,
    fontFamily: "Gilroy-Regular",
  },
  footer: { 
    marginTop: 20, 
    fontSize: 14, 
    color: "#555" 
  },
  forgot: { 
    color: "#333", 
    fontFamily: "Gilroy-Regular", 
    textDecorationLine: "underline" 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "600", 
    marginBottom: 40, 
    alignSelf: "flex-start", 
    fontFamily: "Gilroy-ExtraBold" 
  },
  icon: { 
    width: 20, 
    height: 20, 
    marginRight: 10, 
    tintColor: "#888", 
    resizeMode: "contain" 
  },
  input: { 
    flex: 1, 
    height: 48, 
    fontSize: 16, 
    fontFamily: "Gilroy-Regular" 
  },
  inputError: {
    borderColor: "red",
  },
  inputWrapper: {
    flexDirection: "row", 
    alignItems: "center", 
    borderColor: "#ddd", 
    borderWidth: 1,
    borderRadius: 12, 
    paddingHorizontal: 12, 
    marginBottom: 20, 
    width: "100%"
  },
  logo: { 
    width: 160, 
    height: 100, 
    resizeMode: "contain", 
    marginTop: 60, 
    marginBottom: 30 
  },
  oauthBtn: {
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f4f4f4", 
    padding: 14,
    borderRadius: 12, 
    width: "100%", 
    marginBottom: 12
  },
  oauthIcon: { 
    width: 24, 
    height: 24, 
    marginRight: 12, 
    resizeMode: "contain" 
  },
  oauthText: { 
    fontSize: 16, 
    fontFamily: "Gilroy-Regular" 
  },
  or: { 
    fontSize: 14, 
    color: "#aaa", 
    marginVertical: 20 
  },
  rememberText: { 
    marginLeft: 8, 
    fontSize: 14, 
    fontFamily: "Gilroy-Regular" 
  },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "100%", 
    alignItems: "center", 
    marginVertical: 12 
  },
  scrollContent: { 
    alignItems: "center", 
    justifyContent: "flex-start" 
  },
  signin: { 
    color: "#4f6df5", 
    fontWeight: "500", 
    textDecorationLine: "underline" 
  },
  signupBtn: {
    backgroundColor: "#4f6df5", 
    borderRadius: 16, 
    paddingVertical: 14, 
    paddingHorizontal: 30,
    width: "100%", 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 20, 
    marginBottom: 40
  },
  signupText: { 
    color: "#fff", 
    fontFamily: "Gilroy-Regular", 
    fontSize: 16, 
    marginRight: 8 
  },
  switchRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
});