// RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import LoadingModal from "./LoadingModal";
import { SafeAreaView } from "react-native-safe-area-context";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingModal isLoading={isLoading}></LoadingModal>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../assets/back.png")}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Register</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.inputField}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          style={styles.inputField}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Text>{isPasswordVisible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.inputField}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Text>{isPasswordVisible ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleRegister}
        style={[styles.button, styles.loginButton]}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text
          onPress={() => navigation.navigate("Login")}
          style={styles.guestText}
        >
          Remember password? Login
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  backButton: {
    alignSelf: "flex-start",
    marginTop: 50,
    marginLeft: 0,
  },
  backButtonImage: {
    width: 41,
    height: 41,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 28,
    color: "#FFF",
    float: "left",
    marginBottom: 30,
  },
  inputField: {
    width: "100%",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  visibilityToggle: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    padding: 10,
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
    alignItems: "inline",
  },
  registerText: {
    color: "#35C2C1",
    fontSize: 18,
    alignItems: "inline",
  },
  guestText: {
    color: "#35C2C1",
    fontSize: 18,
    marginTop: 15,
  },
});

export default RegisterScreen;
