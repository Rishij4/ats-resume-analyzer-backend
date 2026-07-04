import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadResume } from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "resume", maxCount: 1 },
    {
      name: "jobDescriptionFile",
      maxCount: 1,
    },
  ]),
  uploadResume
);

export default router;