import React, { useState } from "react";
import { View, Text, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
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

export default function ImageSelect() {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  async function pickImage(mode) {
    let result;
    if (mode == "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
    } else if (mode == "gallery") {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Image Preview</Text>
      <Image
        source={
          selectedImage
            ? { uri: selectedImage }
            : require("../assets/image.png")
        }
        style={{ width: "75%", height: "75%" }}
      />
      <Button
        title="Take picture of your ticket"
        onPress={() => pickImage("camera")}
      />
      <Button
        title="Upload image from gallery"
        onPress={() => pickImage("gallery")}
      />
      {selectedImage ? (
        <Button
          title="Confirm image"
          onPress={async () => await uploadImage(selectedImage, navigation)}
        />
      ) : null}
    </View>
  );
}
