import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { Camera } from "expo-camera";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { push, ref as databaseRef, set } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../firebaseConfig";
import OCRImage from "../vision";
import { useNavigation } from "@react-navigation/native";

const DB_TICKETS_KEY = "tickets";
const STORAGE_KEY = "images/";

async function createTicket(url) {
  const ticketListRef = databaseRef(database, DB_TICKETS_KEY);
  const newTicketRef = push(ticketListRef);
  const newDate = new Date();
  OCRImage(url).then((response) => {
    console.log(response);
    set(newTicketRef, {
      date: newDate.toString(),
      url: url,
      parsedText: response,
    });
    console.log("ticket created!");
  });
}

async function uploadImage(uri) {
  const key = uuidv4();
  const fullStorageRef = storageRef(storage, STORAGE_KEY + "/" + key);
  const response = await fetch(uri);
  const blob = await response.blob();
  uploadBytes(fullStorageRef, blob).then(() => {
    console.log("image uploaded!");
    getDownloadURL(fullStorageRef, key).then((url) => {
      createTicket(url);
    });
  });
}

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  async function takePicture() {
    if (camera) {
      const data = await camera.takePictureAsync();
      const imageURL = await uploadImage(data.uri);
      return imageURL;
      // Navigate to the AppealScreen with the imageURL as a parameter
      navigation.navigate("AppealScreen", { imageURL:url });
    }
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={(ref) => setCamera(ref)}>
        {/* Rest of your camera UI here */}</Camera>
        <Button
      title="Take picture of your ticket"
      onPress={async () => {
        const imageURL = await takePicture();
        navigation.navigate("Appeal", { imageURL });
      }}
    />
      
      <Button
        title="Flip Camera"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      />
    </View>
  );
}
