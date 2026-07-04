// textCleaner.js
const cleanText = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()

    // remove special symbols
    .replace(/[^\w\s]/g, " ")

    // remove extra spaces
    .replace(/\s+/g, " ")

    .trim();
};

export { cleanText };