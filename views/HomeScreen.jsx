import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserEmail(user.email);
    });
  }, []);

  function handleLogout() {
    signOut(auth).then(() => {
      console.log("signout successful");
      navigation.navigate("Splash");
    });
  }
  return (
    <View
      style={{
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100%",
      }}
    >
      <View
        style={{
          height: "25%",
          width: "50%",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "red",
        }}
      >
        <Text>Welcome to GaoDim, {userEmail}</Text>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      <View
        style={{
          height: "25%",
          width: "50%",
          justifyContent: "space-evenly",
          alignItems: "center",
          backgroundColor: "green",
        }}
      >
        <Text>Status of tickets + Money saved</Text>
      </View>
    </View>
  );
}
