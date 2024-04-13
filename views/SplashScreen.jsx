// SplashScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebaseConfig";

const SplashScreen = ({ navigation }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
        navigation.navigate("Main");
      } else {
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/image.png")} style={styles.logo} />
      </View>
      <Text style={styles.title}>GAODIM</Text>
      <Text style={styles.subtitle}>Fix your parking woes swiftly</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={[styles.button, styles.loginButton]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={[styles.button, styles.registerButton]}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text style={styles.guestText}>Continue as a guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A1F",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    width: "341px",
    height: "341px",
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 24,
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#1E232C",
    color: "#ffffff",
  },
  registerButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  guestText: {
    color: "#35C2C1",
    fontSize: 18,
    marginTop: 15,
  },
});

export default SplashScreen;
