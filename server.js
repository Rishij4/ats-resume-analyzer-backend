import dotenv from "dotenv";
dotenv.config();
console.log(process.env.GEMINI_API_KEY);
import express from "express";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/upload", uploadRoutes);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("ATS Resume Analyzer API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});