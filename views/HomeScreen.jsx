import React from "react";
import { View, Text, Button } from "react-native";

import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  function handleLogout() {
    signOut(auth).then(() => {
      console.log("signout successful");
      navigation.navigate("Splash");
    });
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Status of tickets + Money saved</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
