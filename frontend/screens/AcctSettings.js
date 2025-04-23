import React, { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function AcctSettings({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("johndoesmyit.edu");
  const [studentID, setStudentID] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        return;
      }

      const userId = session?.user?.id;
      if (!userId) {
        console.warn("No user session found.");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else if (data?.full_name) {
        setName(data.full_name);
        setEmail(data.email);
      }
    };

    fetchName();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Back Arrow */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backArrow}
      >
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Account Details</Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        placeholder="Enter email"
      />

      <Text style={styles.label}>Student ID</Text>
      <TextInput
        value={studentID}
        onChangeText={setStudentID}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter ID"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value="••••••••"
        style={[styles.input, styles.disabledInput]}
        editable={false}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>SAVE CHANGES</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    position: "absolute",
    top: 50,
    left: 28,
  },
  backArrowText: {
    fontSize: 26,
    color: "#333",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
    fontFamily: "Gilroy-Bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "Gilroy-SemiBold",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Gilroy-Regular",
  },
  disabledInput: {
    backgroundColor: "#f1f1f1",
    color: "#aaa",
  },
  saveButton: {
    marginTop: 40,
    backgroundColor: "#4f6df5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Gilroy-SemiBold",
  },
});
