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
  Alert,
} from "react-native";

export default function AcctSettings({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentID, setStudentID] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user?.id) {
        console.error("Session error:", sessionError);
        return;
      }

      const id = session.user.id;
      setUserId(id);

      const { data: authUser } = await supabase.auth.getUser();

      const nameFromAuth = authUser?.user?.user_metadata?.full_name || "";
      const studentIdFromAuth = authUser?.user?.user_metadata?.student_id || "";
      const emailFromAuth = authUser?.user?.email || "";

      setName(nameFromAuth);
      setStudentID(studentIdFromAuth);
      setEmail(emailFromAuth);
      setOriginalEmail(emailFromAuth);

      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, student_id")
        .eq("id", id)
        .single();

      if (!error) {
        console.log("DB copy:", data);
      }

      /*if (error) {
        console.error("Error fetching user:", error);
      } else {
        setName(data.full_name || "");
        setEmail(data.email || "");
        setOriginalEmail(data.email || "");
        setStudentID(data.student_id || "");
      }*/
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    console.log("handleSave triggered!");
    if (email !== originalEmail) {
      Alert.alert(
        "Warning",
        "Changing your email will permanently delete this account. Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes, proceed",
            onPress: async () => {
              await handleEmailChange();
            },
          },
        ]
      );
    } else {
      // Normal update path
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: name,
          student_id: studentID,
        })
        .eq("id", userId);

      if (!updateError) {
        console.log("✅ Updated users table");
      }

      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          student_id: studentID,
        },
      });

      console.log("Auth metadata update response:", metaError);

      if (updateError || metaError) {
        console.error("Update error:", updateError || metaError);
        setTimeout(() => {
          Alert.alert("Error", "Could not update your details.");
        }, 100);
      } else {
        setOriginalEmail(email);
        setTimeout(() => {
          Alert.alert("Success", "Your changes have been saved.");
        }, 100);

        if (!name || !studentID) {
          await supabase.from("notifications").insert([
            {
              user_id: userId,
              type: "profile_update",
              status: "pending",
            },
          ]);
        } else {
          // If they complete info, mark any pending profile_update as resolved
          await supabase
            .from("notifications")
            .update({ status: "resolved" })
            .eq("user_id", userId)
            .eq("type", "profile_update")
            .eq("status", "pending");
        }
      }
    }
  };

  const handleEmailChange = async () => {
    try {
      const response = await fetch(
        "https://sitsmart.functions.supabase.co/delete-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const text = await response.text();
      console.log("Function response text:", text);

      // Only parse as JSON if you know it's JSON
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = { success: true }; // fallback
      }

      if (!response.ok) {
        console.error("Function error:", result.error);
        Alert.alert("Error", "Could not delete account.");
        return;
      }
      console.log("Function success:", text);

      await supabase.auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: "SignUp" }] });
    } catch (err) {
      console.error("Error deleting user:", err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  disabledInput: {
    backgroundColor: "#f1f1f1",
    color: "#aaa",
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
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 10,
    fontFamily: "Gilroy-SemiBold",
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 30,
    fontFamily: "Gilroy-Bold",
  },
});
