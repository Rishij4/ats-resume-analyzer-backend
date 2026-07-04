import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
  "application/pdf",

  // DOCX
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // DOC
  "application/msword",

  // TXT
  "text/plain",

  "image/jpeg",
  "image/png",
  "image/jpg",
];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, JPG, PNG allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;