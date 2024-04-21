import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
import LetterModal from "./LetterModal";

// Creating ticket once chatGPT response is produced

function removeBase64Prefix(base64String) {
  const commaIndex = base64String.indexOf(",");
  return commaIndex !== -1 ? base64String.slice(commaIndex + 1) : base64String;
}

export default function AppealScreen({ navigation }) {
  const [reason, setReason] = useState("");
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
      const gptPrompt = generateGPTPrompt(reason, visionApiResponse);
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

  // UI rendering
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.screenTitle}>
          Under what grounds do you want to contest the ticket?
        </Text>
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
            placeholderTextColor="black"
          />
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleReasonSubmit()}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>Get the Appeal Letter Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => navigation.navigate("Main")} //close the modal when clicking change reason
        >
          <Text style={styles.buttonText}>Take Picture Again</Text>
        </TouchableOpacity>
      </View>
      <LoadingModal isLoading={isLoading}></LoadingModal>
      <LetterModal
        navigation={navigation}
        text={gptResponse}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        needChanging={true}
      ></LetterModal>
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
    marginBottom: 100,
    fontSize: 27,
    lineHeight: 32.4,
    textAlign: "center",
  },

  inputContainer: {
    width: "80%",
    color: "#fff",
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
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

  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#35C2C1",
    width: "80%",
    height: "40%",
    borderRadius: 25,
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
  },
});
