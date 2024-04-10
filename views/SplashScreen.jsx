// SplashScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebaseConfig";

const SplashScreen = ({ navigation }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
        navigation.navigate("Home");
      } else {
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAODIM</Text>
      <Text style={styles.subtitle}>Fix your parking woes swiftly</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Continue as a guest"
        onPress={() => navigation.navigate("Main")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 24,
  },
});

export default SplashScreen;
