import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { generateGPTPrompt, callGPTAPI } from "../gpt";
import OCRImage from "../vision";
import { useRoute } from "@react-navigation/native";

function removeBase64Prefix(base64String) {
  const commaIndex = base64String.indexOf(",");
  return commaIndex !== -1 ? base64String.slice(commaIndex + 1) : base64String;
}

export default function AppealScreen() {
  const [reason, setReason] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const route = useRoute();

  const { imageURL } = route.params || {}; // Extract imageURL from navigation parameters
  const visionApiResponse = useRef(null);

  // didMound
  useEffect(() => {
    OCRImage(imageURL)
      .then((response) => {
        console.log("Appeal:", response);
        visionApiResponse.current = response;
        console.log("visionResponse:", visionApiResponse.current);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Function to handle reason input change
  const handleReasonChange = (text) => {
    setReason(text);
  };

  //assign response from Vision.js

  // Function to send Vision API response to GPT
  async function sendToGPT(reason, url) {
    try {
      const gptPrompt = generateGPTPrompt(reason, visionApiResponse.current);
      const gptGeneratedContent = await callGPTAPI(gptPrompt);
      setGptResponse(gptGeneratedContent);
    } catch (error) {
      console.error("Error processing response:", error);
      alert("An error occurred while generating the appeal content.");
    }
  }
  // UI rendering
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Appeal Reason</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleReasonChange}
          value={reason}
          placeholder="Enter reason"
        />
      </View>
      <Button
        onPress={() => sendToGPT(reason, imageURL)}
        title="Get the Appeal Letter Now"
      />
      {gptResponse ? <Text>{gptResponse}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
  },
});
