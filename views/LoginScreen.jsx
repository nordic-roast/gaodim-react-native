// RegisterScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

import { auth } from "../firebaseConfig";

import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then(() => {
      navigation.navigate("Main");
    });
  };
 
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/back.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
      <Text style={styles.welcomeText}>Welcome to Gaodim</Text>
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
          <Text>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, styles.loginButton]}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text
          onPress={() => navigation.navigate("Register")}
          style={styles.guestText}>
          No account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A1F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 50,
    marginLeft: 0,
  },
  backButtonImage: {
    width: 41,
    height: 41,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 28,
    color: '#FFF',
    float: 'left',
    marginBottom: 30,
  },
  inputField: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  visibilityToggle: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#1E232C',
    color: '#ffffff',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    alignItems: 'inline',
  },
  registerText: {
    color: '#35C2C1',
    fontSize: 18,
    alignItems: 'inline',
  },
  guestText: {
    color: '#35C2C1',
    fontSize: 18,
    marginTop: 15,
  },
});

export default LoginScreen;
