import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import * as Clipboard from "expo-clipboard";

function LetterModal({
  navigation,
  text,
  modalVisible,
  setModalVisible,
  needChanging,
}) {
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
      <View style={[styles.modalView]}>
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "row-reverse",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity
            style={[styles.closeButtonContainer]}
            onPress={() => { 
              setModalVisible(!modalVisible);
              navigation.navigate("Main");
            }}
          >
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 15, width: "100%", paddingVertical: "5%" }}>
          <ScrollView style={{ flex: 1, backgroundColor: "#F0FFF0" }}>
            {text ? <Text style={styles.modalText}>{text}</Text> : null}
          </ScrollView>
        </View>
        <View
          style={{ flex: 4, width: "100%", justifyContent: "space-between" }}
        >
          {needChanging ? (
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.buttonText}>Change the Appeal Reason</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => copyToClipboard()}
          >
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "80%",
    color: "#fff",
    flex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    backgroundColor: "#fff",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: "5%",
  },

  modalView: {
    padding: "5%",
    margin: "5%",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#35C2C1",
    width: "80%",
    height: "40%",
    borderRadius: 25,
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
  },

  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#35C2C1",
    height: "40%",
    borderRadius: 8,
  },

  modalText: {
    marginBottom: 20,
    padding: 30,
    lineHeight: 20,
    textAlign: "justify",
    fontSize: 18,
  },

  closeButtonContainer: {
    backgroundColor: "#35C2C1",
    alignItems: "center",
    paddingHorizontal: "3%",
    justifyContent: "center",
    borderRadius: 50,
  },

  closeButtonText: {
    color: "black",
    fontSize: 20,
  },
});

export default LetterModal;
