async function OCRImage(url) {
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



  const response = await fetch(
    "https://vision.googleapis.com/v1/images:annotate?key=${apikey}",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      console.log("OCR successful!");
      let obj = JSON.parse(result);
      console.log(result)
      return obj["responses"][0]["fullTextAnnotation"]["text"].toString();
    })
    .catch((error) => console.error(error));

  return response;
}
export default OCRImage;