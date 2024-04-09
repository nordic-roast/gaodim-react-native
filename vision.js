const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
  keyFilename: "vision_api_key.json",
});

const asyncExample = async () => {
  try {
    const [result] = await client.documentTextDetection(
      "./assets/parking-offence.webp"
    );
    console.log("success!");
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

export default asyncExample;
