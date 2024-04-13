import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { generateGPTPrompt, callGPTAPI } from "../gpt";
import OCRImage from "../vision";
import { useRoute } from "@react-navigation/native";

import { firestore } from "../firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebaseConfig";

// Creating ticket once chatGPT response is produced

function removeBase64Prefix(base64String) {
  const commaIndex = base64String.indexOf(",");
  return commaIndex !== -1 ? base64String.slice(commaIndex + 1) : base64String;
}

export default function AppealScreen({ navigation }) {
  const [reason, setReason] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [userId, setUserId] = useState("");
  const route = useRoute();

  async function createTicket(url, navigation, reason, gptGeneratedContent) {
    const ticketRef = doc(firestore, userId, uuidv4());
    const newDate = new Date();
    try {
      await setDoc(ticketRef, {
        date: newDate.toString(),
        url: url ? url : "sampleurl",
        reason: reason,
        letter: gptGeneratedContent,
      });
      console.log("ticket write success");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserId(user.uid);
    });
  }, []);

  const { imageURL } = route.params || {}; // Extract imageURL from navigation parameters
  const visionApiResponse = "";

  async function handleReasonSubmit() {
    try {
      const visionApiResponse = await OCRImage(imageURL);
      const gptPrompt = generateGPTPrompt(
        reason,
        visionApiResponse,
        firstName,
        lastName
      );
      const gptGeneratedContent = await callGPTAPI(gptPrompt);
      await createTicket(imageURL, navigation, reason, gptGeneratedContent);
      setGptResponse(gptGeneratedContent);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const handleReasonChange = (text) => {
    setReason(text);
  };
  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };
  const handleLastNameChange = (text) => {
    setLastName(text);
  };

  // Clipboard handling

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
        <TextInput
          style={styles.input}
          onChangeText={handleFirstNameChange}
          value={firstName}
          placeholder="First name (optional)"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleLastNameChange}
          value={lastName}
          placeholder="Last name (optional)"
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
    marginBottom: "5%",
  },
});
