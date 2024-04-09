// RegisterScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";

import { auth } from "../firebaseConfig";

import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      navigation.navigate("Home");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={{ color: "white" }}
        onPress={() => navigation.navigate("Register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000",  
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
});

export default LoginScreen;
