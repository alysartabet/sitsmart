import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions, 
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";


const { width } = Dimensions.get("window");

export default function Authentication({ navigation }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); 
  const toggleRemember = () => setRememberMe((prev) => !prev);
  const togglePasswordVisibility = () =>
    setPasswordVisible((prev) => !prev);
  const [isSignIn, setIsSignIn] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isSignUp ? -width : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isSignUp]);

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={60}
    >
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
        <View style={styles.container}>
            {/* Back Arrow */}
            {isSignUp && (
            <TouchableOpacity onPress={() => setIsSignUp(false)} style={styles.backArrow}>
                <Text style={styles.backArrowText}>←</Text>
            </TouchableOpacity>
            )}

            {/* Logo */}
            <Image source={require("../assets/images/logo-wrapper.png")} style={styles.logo} />

            {/* Title */}
            <Text style={styles.heading}>{isSignUp ? "Sign up" : "Sign in"}</Text>

            {/* Sliding Viewport */}
            <View style={styles.sliderViewport}>
            {/* Animated Sliding Forms */}
            <Animated.View style={[styles.authWrapper, { transform: [{ translateX: slideAnim }, {scale: 0.93},] }]}>

                {/* ------- Sign In Form ------- */}
                <View style={styles.formContainer}>
                {/* Email */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/mail.png")} style={styles.icon} />
                    <TextInput placeholder="abc@schoolemail.edu" placeholderTextColor="#888" style={styles.input} />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/lock.png")} style={styles.icon} />
                    <TextInput placeholder="Your password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={styles.input} />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Remember + Forgot */}
                <View style={styles.row}>
                    <View style={styles.switchRow}>
                    <Switch value={rememberMe} onValueChange={toggleRemember} trackColor={{ false: "#ccc", true: "#4f6df5" }} thumbColor={rememberMe ? "#fff" : "#f4f3f4"} />
                    <Text style={styles.rememberText}>Remember Me</Text>
                    </View>
                    <TouchableOpacity><Text style={styles.forgot}>Forgot Password?</Text></TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity style={styles.signinBtn}>
                    <Text style={styles.signinText}>SIGN IN</Text>
                    <Text style={styles.arrow}>➝</Text>
                </TouchableOpacity>

                {/* OAuth */}
                <Text style={styles.or}>OR</Text>
                <TouchableOpacity style={styles.oauthBtn}>
                    <Image source={require("../assets/images/microsoft.png")} style={styles.oauthIcon} />
                    <Text style={styles.oauthText}>Sign in with Microsoft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oauthBtn}>
                    <Image source={require("../assets/images/sso.png")} style={styles.oauthIcon} />
                    <Text style={styles.oauthText}>Sign in with SSO</Text>
                </TouchableOpacity>

                {/* Switch to Sign Up */}
                <Text style={styles.footer}>
                    Don’t have an account?{" "}
                    <Text style={styles.signup} onPress={() => setIsSignUp(true)}>Sign up</Text>
                </Text>
                </View>

                {/* ------- Sign Up Form ------- */}
                <View style={styles.formContainer}>
                {/* Full Name */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/profile.png")} style={styles.icon} />
                    <TextInput placeholder="Full name" placeholderTextColor="#888" style={styles.input} />
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/mail.png")} style={styles.icon} />
                    <TextInput placeholder="abc@email.com" placeholderTextColor="#888" style={styles.input} />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/lock.png")} style={styles.icon} />
                    <TextInput placeholder="Your password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={styles.input} />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputWrapper}>
                    <Image source={require("../assets/images/lock.png")} style={styles.icon} />
                    <TextInput placeholder="Confirm password" placeholderTextColor="#888" secureTextEntry={!passwordVisible} style={styles.input} />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image source={passwordVisible ? require("../assets/images/visible.png") : require("../assets/images/hidden.png")} style={styles.icon} />
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signinBtn}>
                    <Text style={styles.signinText}>SIGN UP</Text>
                    <Text style={styles.arrow}>➝</Text>
                </TouchableOpacity>

                {/* OAuth */}
                <Text style={styles.or}>OR</Text>
                <TouchableOpacity style={styles.oauthBtn}>
                    <Image source={require("../assets/images/microsoft.png")} style={styles.oauthIcon} />
                    <Text style={styles.oauthText}>Sign in with Microsoft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.oauthBtn}>
                    <Image source={require("../assets/images/sso.png")} style={styles.oauthIcon} />
                    <Text style={styles.oauthText}>Sign in with SSO</Text>
                </TouchableOpacity>

                {/* Switch to Sign In */}
                <Text style={styles.footer}>
                    Already have an account?{" "}
                    <Text style={styles.signup} onPress={() => setIsSignUp(false)}>Sign in</Text>
                </Text>
                </View>

            </Animated.View>
            </View>
        </View>
     </ScrollView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",

    },
    scrollContent: {
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "flex-start",
      },
    formContainer: {
      width: width,
      alignItems: "center",
    },
    logo: {
      width: 160,
      height: 100,
      resizeMode: "contain",
      marginVertical: 30,
      marginTop: 60,
    },
    heading: {
      fontSize: 24,
      fontWeight: "600",
      marginTop: -10,
      marginLeft: 40,
      marginBottom: -10,
      alignSelf: "flex-start",
      fontFamily: "Gilroy-ExtraBold",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 12,
      width: "100%" ,
      marginTop: 10,
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
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
      marginVertical: 12,
    },
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
    },
    rememberText: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: "Gilroy-Regular",
    },
    forgot: {
      color: "#333",
      fontFamily: "Gilroy-Regular",
      textDecorationLine: "underline",
      marginTop: 20,
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
      marginBottom: 60,
    },
    signinText: {
      color: "#fff",
      fontFamily: "Gilroy-Regular",
      fontSize: 16,
      marginRight: 8,
    },
    arrow: {
      color: "#fff",
      fontSize: 18,
    },
    or: {
      fontSize: 14,
      color: "#aaa",
      marginVertical: 10,
      marginBottom: 40,
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
    footer: {
      marginTop: 20,
      fontSize: 14,
      color: "#555",
    },
    signup: {
      color: "#4f6df5",
      fontWeight: "500",
      textDecorationLine: "underline",
    },
    sliderViewport: {
        width: Dimensions.get("window").width,
        overflow: 'hidden', 
      },
    authWrapper: {
        flexDirection: "row",
        width: Dimensions.get("window").width * 2,
    },
    backArrow: {
        alignSelf: "flex-start",
        marginTop: 30,
        marginBottom: -40,
        marginLeft: 10,
    },
    backArrowText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
  });