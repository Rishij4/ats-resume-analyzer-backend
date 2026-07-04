import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
};

const extractTextFromImage = async (filePath) => {
  const result = await Tesseract.recognize(
    filePath,
    "eng"
  );

  return result.data.text;
};

/* NEW */

const extractTextFromTXT = async (
  filePath
) => {
  const data =
    await fs.readFile(
      filePath,
      "utf-8"
    );

  return data;
};

const extractResumeText = async (
  filePath,
  mimetype
) => {
  try {
    // PDF
    if (
      mimetype ===
      "application/pdf"
    ) {
      return await extractTextFromPDF(
        filePath
      );
    }

    // DOCX
    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractTextFromDOCX(
        filePath
      );
    }

    /* NEW TXT SUPPORT */

    if (
      mimetype ===
      "text/plain"
    ) {
      return await extractTextFromTXT(
        filePath
      );
    }

    // IMAGE
    if (
      mimetype ===
        "image/jpeg" ||
      mimetype ===
        "image/png" ||
      mimetype ===
        "image/jpg"
    ) {
      return await extractTextFromImage(
        filePath
      );
    }

    throw new Error(
      "Unsupported file format"
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { extractResumeText };