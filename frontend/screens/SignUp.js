import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, Image,
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";

export default function SignUp({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(prev => !prev);

  const handleSignUp = () => {
    // Connect to backend logic later
    navigation.navigate("Preferences");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Back Arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
            <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>

        <Image source={require("../assets/images/logo-wrapper.png")} style={styles.logo} />
        <Text style={styles.heading}>Sign up</Text>

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/profile.png")} style={styles.icon} />
          <TextInput placeholder="Full name" placeholderTextColor="#888" style={styles.input} />
        </View>

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/mail.png")} style={styles.icon} />
          <TextInput placeholder="abc@email.com" placeholderTextColor="#888" style={styles.input} />
        </View>

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/lock.png")} style={styles.icon} />
          <TextInput placeholder="Your password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={styles.input} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <Image source={require("../assets/images/lock.png")} style={styles.icon} />
          <TextInput placeholder="Confirm password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={styles.input} />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signinBtn} onPress={handleSignUp}>
          <Text style={styles.signinText}>SIGN UP</Text>
          <Text style={styles.arrow}>➝</Text>
        </TouchableOpacity>

        <Text style={styles.or}>OR</Text>

        <TouchableOpacity style={styles.oauthBtn}>
          <Image source={require("../assets/images/microsoft.png")} style={styles.oauthIcon} />
          <Text style={styles.oauthText}>Sign up with Microsoft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oauthBtn}>
          <Image source={require("../assets/images/sso.png")} style={styles.oauthIcon} />
          <Text style={styles.oauthText}>Sign up with SSO</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={styles.signup} onPress={() => navigation.navigate("SignIn")}>
            Sign in
          </Text>
        </Text>
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
    alignItems: "center" 
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
    marginBottom: 20, 
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
  inputWrapper: {
    flexDirection: "row", 
    alignItems: "center", 
    borderColor: "#ddd", 
    borderWidth: 1,
    borderRadius: 12, 
    paddingHorizontal: 12, 
    marginBottom: 12, 
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
  signinBtn: {
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
  signinText: { 
    color: "#fff", 
    fontFamily: "Gilroy-Regular", 
    fontSize: 16, 
    marginRight: 8 
  },
  signup: { 
    color: "#4f6df5", 
    fontWeight: "500", 
    textDecorationLine: "underline" 
  },
  switchRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
});