import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const questions = [
  {
    question: "Where in the classroom do you prefer to study?",
    options: ["Front", "Middle", "Back"],
  },
  {
    question: "How important is natural lighting to you",
    options: ["Very Important", "Somewhat important", "Not Important"],
  },
  {
    question: "Do you prefer to work in a group or solo",
    options: ["Group", "Solo"],
  },
  {
    question: "What size of the classroom do you prefer",
    options: ["Massive", "Medium", "Small"],
  },
  {
    question: "How important is noise control in the classroom",
    options: ["I need quiet", "Low is ok", "Loud is fine"],
  },
];

export default function Preferences({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit or navigate elsewhere
      navigation.navigate("Home"); // Adjust destination as needed
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <Image
          source={require("../assets/images/filter.png")}
          style={styles.filterIcon}
        />
      </View>

      {/* Koala */}
      <Image
        source={require("../assets/images/happykoala.png")}
        style={styles.koala}
      />

      {/* Text */}
      <Text style={styles.heading}>Let’s get to know your preferences! 🧠</Text>
      <Text style={styles.subheading}>
        Answer a few quick questions so we can customize your experience.
      </Text>

      {/* Question */}
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {/* Options */}
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.optionText,
              index === 0 && { color: "white", fontWeight: "600" },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {questions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 28,
    fontWeight: "600",
    marginLeft: 10,
    marginTop: -10,
  },
  filterIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "#333",
  },
  koala: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginVertical: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    fontFamily: "Gilroy-ExtraBold",
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },
  question: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 20,
    fontFamily: "Gilroy-Regular",
  },
  option: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 15,
    fontFamily: "Gilroy-Regular",
  },
  progressBar: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  activeDot: {
    backgroundColor: "#4f6df5",
  },
});