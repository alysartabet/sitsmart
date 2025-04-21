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

export default function Verification({ navigation, route }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);


  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
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

  const handleSend = async () => {
    const fullCode = code.join("");
  const { email } = route.params || {};

  if (!email || fullCode.length < 4) {
    alert("Please enter all 4 characters of your code.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("reset_codes")
      .select("code, created_at")
      .eq("email", email.toLowerCase().trim())
      .gt("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()) // code is less than 5 mins old
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      alert("No valid code found for this email.");
      return;
    }

    if (data.code === fullCode) {
      // Delete all codes for cleanup
      await supabase
        .from("reset_codes")
        .delete()
        .eq("email", email.toLowerCase().trim());

      navigation.navigate("ChangePassword", { email });
    } else {
      alert("Incorrect code. Please try again.");
    }
  } catch (err) {
    console.error("Verification error:", err);
    alert("An error occurred. Please try again.");
  }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleResendCode = async () => {
    const { email } = route.params || {};
    if (!email) return;
  
    const newCode = generateCode(); 
  
    await supabase.from("reset_codes").insert([
      {
        email: email.toLowerCase().trim(),
        code: newCode,
      },
    ]);
  
    // Send the email again
    await fetch("https://osldfluzgpxzeuvwfwvu.functions.supabase.co/send-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ to: email, code: newCode }),
    });
  
    alert("A new verification code has been sent!");
  
    setTimer(20);
    setCanResend(false);
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
        The code is case sensitive!
      </Text>

      {/* Code Inputs */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={handleSend} >
        <Text style={styles.sendText}>SEND</Text>
        <Text style={styles.arrow}>➝</Text>
      </TouchableOpacity>

      {/* Resend */}
      {canResend ? (
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={[styles.resendText, styles.resendLink]}>Didn't get it? Tap to resend code</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.resendText}>
          Re-send code in <Text style={styles.timer}>{`0:${timer < 10 ? `0${timer}` : timer}`}</Text>
        </Text>
      )}
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
  resendLink: {
    color: "#4f6df5",
    fontWeight: "600",
    textDecorationLine: "underline",
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