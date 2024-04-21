import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

import LoadingModal from "./LoadingModal";
import LetterModal from "./LetterModal";

import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebaseConfig";

import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";
import { set } from "firebase/database";

const HistoryScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Get tickets for user

  let docsSnap;

  async function getTickets(userId) {
    setIsLoading(true);
    try {
      docsSnap = await getDocs(collection(firestore, userId));
      let ticketList = [];
      docsSnap.forEach((doc) => {
        ticketList.push(doc.data());
      });
      setTickets(ticketList);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserEmail(user.email);
      setUserId(user.uid);
      getTickets(user.uid);
    });
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <Text>
        {userEmail.substring(0, userEmail.indexOf("@"))}, here are your GaoDim
        tickets so far:
      </Text>
      <LoadingModal isLoading={isLoading}></LoadingModal>
      <LetterModal
        navigation={navigation}
        text={selectedText}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        needChanging={false}
      ></LetterModal>
      <ScrollView
        style={{
          marginHorizontal: "auto",
          width: "80%",
        }}
      >
        {tickets.length != 0 ? (
          tickets.map((ticket, i) => {
            return (
              <View
                style={{
                  backgroundColor: "skyblue",
                  flexDirection: "row",
                  marginBottom: "5%",
                  padding: "2%",
                  borderRadius: 20,
                }}
                key={i}
              >
                <View style={{ flex: 1 }}>
                  <Text>{i + 1}</Text>
                </View>
                <View style={{ flex: 4 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    Date of submission:{" "}
                  </Text>
                  <Text>{ticket["date"]}</Text>
                  <Text style={{ fontWeight: "bold" }}>Link to ticket: </Text>
                  <Text>{ticket["url"]}</Text>
                  <Text style={{ fontWeight: "bold" }}>Letter preview: </Text>
                  <Text>{ticket["letter"].substring(0, 50)}</Text>
                  <Text style={{ fontWeight: "bold" }}>Reason provided: </Text>
                  <Text>{ticket["reason"]}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <TouchableOpacity
                    style={{ backgroundColor: "white", borderRadius: 20 }}
                  >
                    <Text
                      onPress={() => {
                        setSelectedText(ticket["letter"]);
                        setModalVisible(true);
                      }}
                      style={{ textAlign: "center" }}
                    >
                      View Letter
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <Text>You have not submitted any tickets to GaoDim!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;
