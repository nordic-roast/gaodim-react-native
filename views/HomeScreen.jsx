import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import LetterModal from "./LetterModal";
import { firestore } from "../firebaseConfig";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [latestTicket, setLatestTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

  // Get tickets for user
  let docsSnap;


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        setIsLoggedIn(true);
        fetchLatestTicket(user.uid);
      } else {
        setUserEmail("");
        setIsLoggedIn(false);
        setLatestTicket(null);
      }
    });
  }, []);


  async function fetchLatestTicket(userId) {
    try {
      const q = query(collection(firestore, userId), orderBy("date", "desc"), limit(1));
      docsSnap = await getDocs(q);
      let ticketList = [];
      docsSnap.forEach((doc) => {
        ticketList.push(doc.data());
      });
      setTickets(ticketList);
    }
    catch (e) {
      console.error(e);
    }
  };

  function handleLogout() {
    signOut(auth).then(() => {
      console.log("signout successful");
      navigation.navigate("Splash");
    });
  }

  return (
    <ScrollView style={styles.container}>
      {isLoggedIn ? (
        <>
          {/* Header */}
          <View style={styles.header}>

            {/* Profile Icon */}
            <TouchableOpacity style={styles.hideButton}
              onPress={() => {/* Navigate to profile */ }}>
              <Ionicons name="person-circle" size={30} color="white" />
            </TouchableOpacity>

            {/* Logout Text replaced with Logout Icon */}
            <TouchableOpacity onPress={
              userEmail != ""
                ? handleLogout
                : () => {
                  navigation.navigate("Splash");
                }
            }>
              <Ionicons name="exit-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>


          {/* Main content */}
          <View style={styles.content}>

            {/* Appeals Section */}
            {tickets.length != 0 ? (
              tickets.map((ticket, i) => {
                <View style={styles.content}>
                  {/* Latest Ticket Section */}
                  <View style={styles.appealSection}>
                    <Text style={styles.appealsHeader}>Latest Ticket</Text>
                    {latestTicket ? (
                      <TouchableOpacity onPress={() => {/* Navigate to ticket details */ }} style={styles.appealItem}>
                        <View style={styles.appealIndicator} />
                        <View style={styles.appealInfo}>
                          <Text style={styles.appealTitle}>{ticket["letter"].substring(0, 50)}</Text>
                          <Text style={styles.appealId}></Text>
                        </View>
                        <TouchableOpacity onPress={() => {/* Handle view more */ }} style={styles.fileAppealButton}>
                          <Text style={styles.fileAppealButtonText}>View more</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.guestText}>No tickets found.</Text>
                    )}
                  </View>
                </View>
              })
            ): (
              <Text> no tickets found</Text>
            )}

            {/* More Actions Section */}
            <View style={styles.actionsSection}>
              <TouchableOpacity onPress={() => navigation.navigate("Camera")}
                style={styles.actionItem}>
                <Text style={styles.actionItemText}>Add new appeal</Text>
                <Ionicons name="add-circle-outline" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("History")}
                style={styles.actionItem}>
                <Text style={styles.actionItemText}>Appeal history</Text>
                <Ionicons name="time-outline" size={24} color="black" />
              </TouchableOpacity>

            </View>
          </View>
        </>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            {/* Content for users not logged in */}
            <TouchableOpacity>
              <Text
                onPress={() => navigation.navigate("Login")}
                style={styles.guestText}>
                Please log in to view this content.
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A1F',
  },
  guestText: {
    color: '#35C2C1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 18,
    marginTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#191A1F',
  },
  content: {
    padding: 20,
  },
  appealSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
    marginBottom: 20,
  },
  appealItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appealIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 10,
  },
  appealInfo: {
    flex: 1,
  },
  appealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appealId: {
    fontSize: 12,
    color: '#555',
  },
  fileAppealButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  fileAppealButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#555', // Slightly lighter border for definition
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
  },
  actionItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  hideButton: {
    opacity: '0',
  },
  // Additional styles for other components as needed
});

export default HomeScreen;
