async function OCRImage(url) {
  // console.log("url43 >>>>", url);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    requests: [
      {
        image: {
          source: {
            imageUri: url,
          },
        },
        features: [
          {
            type: "DOCUMENT_TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const API_KEY = process.env.EXPO_PUBLIC_VISION_APIKEY;

  return fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log("OCR successful!");
      let obj = JSON.parse(result);
      console.log(">>>>>>>>>>>123123123>>>>>>", result);
      return obj?.["responses"]?.[0]?.["fullTextAnnotation"]?.[
        "text"
      ]?.toString();
    })
    .catch((error) => console.error("vision >>> rror >>>>", error));
}
export default OCRImage;
