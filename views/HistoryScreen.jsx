import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import LoadingModal from "./LoadingModal";
import LetterModal from "./LetterModal";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../firebaseConfig"; 
import { firestore } from "../firebaseConfig";
import {
  collection,
  getDocs, 
  query,
  orderBy,
  limit,
} from "@firebase/firestore";
import { set } from "firebase/database";
import { SafeAreaView } from "react-native-safe-area-context";

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
      const q = query(collection(firestore, userId), orderBy("date", "desc"));
      docsSnap = await getDocs(q);
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
    <SafeAreaView style={styles.container}>
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
                <View style={styles.content} 
                      key={i}
                >
                    {/* Latest Ticket Section */}
                    <View style={styles.appealSection}> 
                      <TouchableOpacity
                        onPress={() => {
                          /* Navigate to ticket details */
                        }}
                        style={styles.appealItem}
                      >
                        <View style={styles.appealIndicator} />
                        <View style={styles.appealInfo}>
                          <Text style={styles.appealTitle}>
                            Appeal reason: {ticket["reason"]}
                          </Text>
                          <Text style={styles.appealId}>{ticket["date"]}</Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            /* Handle view more */
                          }}
                          style={styles.fileAppealButton}
                        >
                          <Text    
                            onPress={() => {
                           setSelectedText(ticket["letter"]);
                           setModalVisible(true);
                      }}
                      style={styles.fileAppealButtonText}>
                            View more
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    </View>
                  </View> 
            );
          })
        ) : (
          <Text>You have not submitted any tickets to GaoDim!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A1F",
  },
  guestText: {
    color: "#35C2C1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 18,
    marginTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#191A1F",
  },
  content: {
    padding: 20,
  },
  appealSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
    marginBottom: 20,
  },
  appealItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  appealIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    marginRight: 10,
  },
  appealInfo: {
    flex: 1,
  },
  appealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  appealId: {
    fontSize: 12,
    color: "#555",
  },
  fileAppealButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  fileAppealButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderColor: "#555",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
  },
  actionItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default HistoryScreen;
