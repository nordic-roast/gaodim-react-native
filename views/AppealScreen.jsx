import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { generateGPTPrompt, callGPTAPI } from "../gpt";
import OCRImage from "../vision";
import { useRoute } from "@react-navigation/native";

function removeBase64Prefix(base64String) {
  const commaIndex = base64String.indexOf(",");
  return commaIndex !== -1 ? base64String.slice(commaIndex + 1) : base64String;
}

export default function AppealScreen({ navigation }) {
  const [reason, setReason] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const route = useRoute();

  const { imageURL } = route.params || {}; // Extract imageURL from navigation parameters
  const visionApiResponse = "";

  async function handleReasonSubmit() {
    try {
      const visionApiResponse = await OCRImage(imageURL);
      const gptPrompt = generateGPTPrompt(reason, visionApiResponse);
      const gptGeneratedContent = await callGPTAPI(gptPrompt);
      setGptResponse(gptGeneratedContent);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // Function to handle reason input change
  const handleReasonChange = (text) => {
    setReason(text);
  };

  //assign response from Vision.js

  // clipboard

  const copyToClipboard = () => {
    Clipboard.setString(gptResponse);
  };

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
        onPress={() => handleReasonSubmit()}
        title="Get the Appeal Letter Now"
      />
      {gptResponse ? (
        <View>
          <Text>{gptResponse}</Text>
          <Button
            onPress={() => copyToClipboard()}
            title="Click here to copy to Clipboard"
          />
        </View>
      ) : null}
      <Button
        title="Return to Home Screen"
        onPress={() => navigation.navigate("Main")}
      />
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
