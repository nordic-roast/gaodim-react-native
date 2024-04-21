import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { generateGPTPrompt, callGPTAPI } from "../gpt";
import OCRImage from "../vision";
import { useRoute } from "@react-navigation/native";

import { Dropdown, close } from "react-native-element-dropdown";

import { firestore } from "../firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import { uuidv4 } from "@firebase/util";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import LoadingModal from "./LoadingModal";

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
  const [hasCustomReason, setHasCustomReason] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultReasons = [
    { label: "I had a medical emergency", value: "I had a medical emergency" },
    { label: "I had a family emergency", value: "I had a family emergency" },
    { label: "My car broke down", value: "My car broke down" },
    {
      label: "There was nowhere else to park",
      value: "There was nowhere else to park",
    },
    {
      label: "I misinterpreted the parking rules in the area",
      value: "I misinterpreted the parking rules in the area",
    },
    { label: "I have financial hardship", value: "I have financial hardship" },
    {
      label: "I was helping someone in need",
      value: "I was helping someone in need",
    },
    {
      label: "I have a medical condition",
      value: "I have a medical condition",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

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
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId("guest");
      }
    });
  }, []);

  const { imageURL } = route.params || {}; // Extract imageURL from navigation parameters
  const visionApiResponse = "";

  async function handleReasonSubmit() {
    setIsLoading(true);
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
      setIsLoading(false);
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

  async function copyToClipboard() {
    await Clipboard.setStringAsync(gptResponse);
  }

  // UI rendering
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>
        Under what grounds do you want to contest the ticket?
      </Text>
      <View style={styles.inputContainer}>
        <Dropdown
          style={styles.input}
          data={defaultReasons}
          labelField="label"
          valueField="value"
          value={reason}
          autoScroll={false}
          placeholder="Select common reason"
          placeholderStyle={{ fontStyle: "italic" }}
          onChange={(item) => {
            {
              item.value != "Other"
                ? (() => {
                    setHasCustomReason(false);
                    handleReasonChange(item.value);
                  })()
                : (() => {
                    handleReasonChange("");
                    setHasCustomReason(true);
                  })();
            }
            close;
          }}
        ></Dropdown>
        {hasCustomReason ? (
          <TextInput
            style={styles.input}
            onChangeText={handleReasonChange}
            value={reason}
            placeholder="Elaborate your reason"
            placeholderTextColor="#ffffff"
          />
        ) : null}
      </View>
      {/*
      <Text style={styles.title}>
        Enter your name to append to the letter (optional)
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleFirstNameChange}
          value={firstName}
          placeholder="First name"
        />
        <TextInput
          style={styles.input}
          onChangeText={handleLastNameChange}
          value={lastName}
          placeholder="Last name"
        />
      </View>
        */}
      <TouchableOpacity
        onPress={() => handleReasonSubmit()}
        style={[styles.getButton]}
      >
        <Text style={styles.title}>Get the Appeal Letter Now</Text>
      </TouchableOpacity>
      <LoadingModal isLoading={isLoading}></LoadingModal>
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
            <View style={styles.contentContainer}>
              <TouchableOpacity
                style={[styles.changeButton]}
                onPress={() => setModalVisible(!modalVisible)} //close the modal when clicking change reason
              >
                <Text style={styles.title}>Change the appeal reason</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => copyToClipboard()}
              >
                <Text style={styles.title}>Copy</Text>
              </TouchableOpacity>
              {gptResponse ? (
                <View>
                  <Text style={styles.modalText}>{gptResponse}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.closeButtonContainer}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  navigation.navigate("Home");
                }}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.reasonButton]}
        onPress={() => navigation.navigate("Main")} //close the modal when clicking change reason
      >
        <Text style={styles.title}>Take Picture Again</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191A1F",
    padding: 20,
  },
  screenTitle: {
    color: "#fff",
    marginBottom: 20,
    marginTop: 100,
    fontSize: 27,
    fontWeight: 700,
    lineHeight: 32.4,
    textAlign: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },

  inputContainer: {
    width: "80%",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "#fff",
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
    position: "absolute",
    bottom: 10,
    margin: 10,
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
  copyButton: {
    position: "absolute",
    top: -120,
    left: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: "#35C2C1",
    width: 331,
    height: 50,
    borderRadius: 8,
  },
  changeButton: {
    position: "absolute",
    top: -60,
    left: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: "#35C2C1",
    width: 331,
    height: 50,
    borderRadius: 8,
  },
  reasonButton: {
    position: "absolute",
    top: 703,
    left: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: "#35C2C1",
    width: 331,
    height: 56,
    borderRadius: 8,
  },
  getButton: {
    position: "absolute",
    top: 633,
    left: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: "#35C2C1",
    width: 331,
    height: 56,
    borderRadius: 8,
  },

  modalText: {
    marginBottom: 20,
    padding: 30,
  },

  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 50,
  },
  closeButtonText: {
    color: "black",
    fontSize: 20,
  },
  contentContainer: {
    position: "relative",
    zIndex: 1,
  },
});
