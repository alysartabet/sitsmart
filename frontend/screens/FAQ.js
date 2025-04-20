import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const faqs = [
  {
    question: "How do I book a room?",
    answer: "You can book a room by navigating to the Search tab, selecting a room, and tapping the Book button.",
  },
  {
    question: "Can I cancel my reservation?",
    answer: "Yes, go to the Calendar tab, select your reservation, and tap Cancel.",
  },
  {
    question: "How do I update my preferences?",
    answer: "Navigate to your Profile and select Preferences to update your classroom and lighting preferences.",
  },
  {
    question: "Can I change the app theme?",
    answer: "Yes, under SitSmart Settings in your Profile, you can switch between Light and Dark display modes.",
  },
  {
    question: "Who do I contact for help?",
    answer: "You can reach out to our support team through the Help option in your Profile.",
  },
];

export default function FAQ({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrowText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Frequently Asked Questions</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {faqs.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <Text style={styles.question}>{item.question}</Text>
            </TouchableOpacity>
            {expandedIndex === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backArrow: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    alignSelf: "center",
    fontFamily: "Gilroy-ExtraBold",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Gilroy-Regular",
    color: "#333",
  },
  answer: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Gilroy-Regular",
    color: "#666",
  },
});