import OpenAI from "openai";

// Function to generate GPT prompt
export function generateGPTPrompt(
  reason,
  visionApiResponse,
  firstName,
  lastName
) {
  const nameContext =
    firstName != "" || lastName != "" ? `${firstName} ${lastName}` : "";

  const prompt = `
  You have received a parking violation notice, and the extracted content from the ticket includes: ${JSON.stringify(
    visionApiResponse
  )}.
  To effectively appeal this notice, it's essential to understand the context of the ticket and combine it with your reason to craft a compelling appeal letter.
  Here is some additional context or information (Reason: ${reason}) that could assist in appealing this notice.

  Generate a response in the format of a formal appeal letter, with salutations, no need to show the header, signature, sign-offs.
    `;

  return prompt.trim();
}

// API key

const API_KEY = process.env.EXPO_PUBLIC_CHATGPT_APIKEY;

// Function to send request to GPT API
export async function callGPTAPI(prompt) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
    timeout: 5000,
  };
  console.log("API Request Options:", options);

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    console.log("API Response:", response);

    const data = await response.json();
    console.log("API Response Data:", data);

    if (data.choices && data.choices.length > 0) {
      return data?.choices?.[0]?.message?.content?.trim();
    } else {
      throw new Error("Failed to get a response from OpenAI.");
    }
  } catch (error) {
    console.error(
      "An error occurred while fetching the GPT-3 response:",
      error
    );
    throw new Error("An error occurred while fetching the GPT-3 response.");
  }
}
