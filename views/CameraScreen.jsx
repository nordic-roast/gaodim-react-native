import React, { useState, useEffect, useRef } from "react";
import { View, Button } from "react-native";
import { Camera } from "expo-camera";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "images/";

async function uploadImage(uri, navigation) {
  const key = uuidv4();
  const fullStorageRef = storageRef(storage, STORAGE_KEY + "/" + key);
  const response = await fetch(uri);
  const blob = await response.blob();
  uploadBytes(fullStorageRef, blob)
    .then(() => {
      console.log("image uploaded!");
      getDownloadURL(fullStorageRef, key).then((url) => {
        console.log("url >>>>>", url);
        navigation.navigate("Appeal", { imageURL: url });
      });
    })
    .catch((error) => {
      console.log("......", error);
    });
}

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  async function takePicture() {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync();
      console.log("takePic:", data);
      await uploadImage(data.uri, navigation);
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
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        {/* Rest of your camera UI here */}
      </Camera>
      <Button
        title="Take picture of your ticket"
        onPress={async () => takePicture()}
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
