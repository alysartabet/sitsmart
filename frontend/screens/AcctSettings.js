import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function AcctSettings({navigation}) {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoesmyit.edu");
  const [studentID, setStudentID] = useState("123456789");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Gilroy-Bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
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
    marginTop: 32,
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