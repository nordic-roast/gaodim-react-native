import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, Button, Modal } from "react-native";
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
  const [modalVisible, setModalVisible] = useState(false); //Add modal state

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
    setModalVisible(true); //when click the button, set modal visable
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {gptResponse ? (
              <View>
                <Text style={styles.modalText}>{gptResponse}</Text>
              </View>
            ) : null}
            <View style={styles.fixToText}>
              <Button
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)} //close the modal when clicking change reason
                title="Change the appeal reason"
              />
              <Button
                onPress={() => copyToClipboard()}
                title="Click here to copy to Clipboard"
              />
            </View>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    podding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
  },
});
