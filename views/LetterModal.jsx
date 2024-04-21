import { View, Text, StyleSheet, Button, Modal } from "react-native";

import * as Clipboard from "expo-clipboard";

function LetterModal({ text, modalVisible, setModalVisible }) {
  async function copyToClipboard() {
    await Clipboard.setStringAsync(text);
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {text ? (
            <View>
              <Text style={styles.modalText}>{text}</Text>
            </View>
          ) : null}
          <View style={styles.fixToText}>
            <Button
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)} //close the modal when clicking change reason
              title="Change the appeal reason"
            />
            <Button
              onPress={() => copyToClipboard()}
              title="Click here to copy to Clipboard"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    podding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
  },
});

export default LetterModal;
