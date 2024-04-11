import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { generateGPTPrompt, callGPTAPI } from "../gpt";
import OCRImage from "../vision";
import { useRoute } from "@react-navigation/native";

export default function AppealScreen() {
    const [reason, setReason] = useState('');
    const [gptResponse, setGptResponse] = useState('');
    const route = useRoute();
    const { imageURL } = route.params || {};; // Extract imageURL from navigation parameters

    // Function to handle reason input change
    const handleReasonChange = (text) => {
        setReason(text);
    };

    console.log(reason)

    //assign response from Vision.js
    let visionApiResponse;
    OCRImage(imageURL)
        .then((response) => {
        consolog.log('Appeal:',response)
        visionApiResponse = response; 
        console.log('visionResponse:',visionApiResponse); 
        })
        .catch((error) => {
        console.error(error);
 });


    // Function to send Vision API response to GPT
    async function sendToGPT(reason, url, API_KEY) {
        try {
            const gptPrompt = generateGPTPrompt(reason, visionApiResponse);
            const gptGeneratedContent = await callGPTAPI(gptPrompt, API_KEY);
            setGptResponse(gptGeneratedContent);
        } catch (error) {
            console.error("Error processing response:", error);
            alert('An error occurred while generating the appeal content.');
        }
    }
    // UI rendering
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Appeal Reason</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={handleReasonChange}
                    value={reason}
                    placeholder="Enter reason"
                />
            </View>
            <Button onPress={() => sendToGPT(reason, imageURL, API_KEY)} title="Get the Appeal Letter Now" />
            {gptResponse && <Text>{gptResponse}</Text>}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '100%',
    },
});
