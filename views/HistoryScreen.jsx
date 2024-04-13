import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebaseConfig";

import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";

const HistoryScreen = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [tickets, setTickets] = useState([]);

  // Get tickets for user

  let docsSnap;

  async function getTickets(userId) {
    try {
      docsSnap = await getDocs(collection(firestore, userId));
      console.log("get success");
      let ticketList = [];
      docsSnap.forEach((doc) => {
        console.log(doc.data());
        ticketList.push(doc.data());
      });
      setTickets(ticketList);
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
    <div>
      <h1>History Screen for {userEmail}</h1>
      {tickets.length != 0 ? (
        tickets.map((ticket, i) => {
          return (
            <View style={{ flexDirection: "row", marginBottom: "5%" }} key={i}>
              <View style={{ flex: 1 }}>
                <Text>{i + 1}</Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text style={{ fontWeight: "bold" }}>Date of submission: </Text>
                <Text>{ticket["date"]}</Text>
                <Text style={{ fontWeight: "bold" }}>Link to ticket: </Text>
                <Text>{ticket["url"]}</Text>
                <Text style={{ fontWeight: "bold" }}>Letter preview: </Text>
                <Text>{ticket["letter"].substring(0, 50)}</Text>
                <Text style={{ fontWeight: "bold" }}>Reason provided: </Text>
                <Text>{ticket["reason"]}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text>You have not submitted any tickets to GaoDim!</Text>
      )}
    </div>
  );
};

export default HistoryScreen;
