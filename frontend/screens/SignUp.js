import React, { useState } from "react";
import { supabase } from "../SupabaseClient";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function SignUp({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const handleFullNameChange = (name) => {
    setFullName(name);

    const parts = name.trim().split(" ");
    if (
      parts.length !== 2 ||
      parts[0].length < 3 ||
      parts[1].length < 3 ||
      !/^[a-zA-Z]+$/.test(parts[0]) ||
      !/^[a-zA-Z]+$/.test(parts[1])
    ) {
      setFullNameError("Enter first and last name (min 3 letters each)");
    } else {
      setFullNameError("");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);

    if (!/^[a-zA-Z0-9._%+-]+@nyit\.edu$/.test(text)) {
      setEmailError("Email must end in @nyit.edu");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (pass) => {
    setPassword(pass);

    if (
      pass.length < 8 ||
      !/[A-Z]/.test(pass) ||
      !/[a-z]/.test(pass) ||
      !/[0-9]/.test(pass) ||
      !/[^A-Za-z0-9]/.test(pass)
    ) {
      setPasswordError(
        "Weak password: 8+ chars, upper/lowercase, number & symbol"
      );
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

  const isValidFullName = (name) => {
    const parts = name.trim().split(" ");
    return (
      parts.length === 2 &&
      parts[0].length >= 3 &&
      parts[1].length >= 3 &&
      /^[a-zA-Z]+$/.test(parts[0]) &&
      /^[a-zA-Z]+$/.test(parts[1])
    );
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@nyit\.edu$/.test(email);
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

  /*const handleSignUp = () => {
      navigation.navigate("Preferences");
    };*/

  const handleSignUp = async () => {
    if (!isValidFullName(fullName)) {
      alert(
        "Please enter a valid full name with first and last name (min. 3 letters each)."
      );
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email must end with @nyit.edu.");
      return;
    }

    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters and include upper, lower, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      // Get UID and update both DB and Auth metadata
      const user = data?.user;

      if (user) {
        const userId = user.id;

        // Store in your own users table
        await supabase.from("users").upsert({
          id: userId,
          email: email,
          full_name: fullName,
        });

        // Update metadata for quick access
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
          },
        });

        navigation.navigate("Preferences");
      }
    } catch (err) {
      console.error(err);
      alert("Sign up failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Arrow */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/images/logo-wrapper.png")}
          style={styles.logo}
        />
        <Text style={styles.heading}>Sign up</Text>

        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="Full name"
            placeholderTextColor="#888"
            style={[styles.input, fullNameError ? styles.inputError : null]}
            onChangeText={handleFullNameChange}
          />
        </View>
        {fullNameError ? (
          <Text style={styles.errorText}>{fullNameError}</Text>
        ) : null}

        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/images/mail.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="abc@email.com"
            placeholderTextColor="#888"
            style={[styles.input, emailError ? styles.inputError : null]}
            onChangeText={handleEmailChange}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/images/lock.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="Your password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            style={[styles.input, passwordError ? styles.inputError : null]}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={
                passwordVisible
                  ? require("../assets/images/visible.png")
                  : require("../assets/images/hidden.png")
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <View style={styles.inputWrapper}>
          <Image
            source={require("../assets/images/lock.png")}
            style={styles.icon}
          />
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            style={[
              styles.input,
              confirmPasswordError ? styles.inputError : null,
            ]}
            onChangeText={handleConfirmPasswordChange}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Image
              source={
                passwordVisible
                  ? require("../assets/images/visible.png")
                  : require("../assets/images/hidden.png")
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.signupText}>SIGN UP</Text>
          <Text style={styles.arrow}>➝</Text>
        </TouchableOpacity>

        <Text style={styles.or}>OR</Text>

        <TouchableOpacity style={styles.oauthBtn}>
          <Image
            source={require("../assets/images/microsoft.png")}
            style={styles.oauthIcon}
          />
          <Text style={styles.oauthText}>Sign up with Microsoft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oauthBtn}>
          <Image
            source={require("../assets/images/sso.png")}
            style={styles.oauthIcon}
          />
          <Text style={styles.oauthText}>Sign up with SSO</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text
            style={styles.signin}
            onPress={() => navigation.navigate("SignIn")}
          >
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
    fontSize: 18,
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
    color: "#555",
  },
  forgot: {
    color: "#333",
    fontFamily: "Gilroy-Regular",
    textDecorationLine: "underline",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    alignSelf: "flex-start",
    fontFamily: "Gilroy-ExtraBold",
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
    height: 48,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
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
    marginBottom: 12,
    width: "100%",
  },
  logo: {
    width: 160,
    height: 100,
    resizeMode: "contain",
    marginTop: 60,
    marginBottom: 30,
  },
  oauthBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 14,
    borderRadius: 12,
    width: "100%",
    marginBottom: 12,
  },
  oauthIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: "contain",
  },
  oauthText: {
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
  },
  or: {
    fontSize: 14,
    color: "#aaa",
    marginVertical: 20,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Gilroy-Regular",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginVertical: 12,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  signin: {
    color: "#4f6df5",
    fontWeight: "500",
    textDecorationLine: "underline",
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
    marginBottom: 40,
  },
  signupText: {
    color: "#fff",
    fontFamily: "Gilroy-Regular",
    fontSize: 16,
    marginRight: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
