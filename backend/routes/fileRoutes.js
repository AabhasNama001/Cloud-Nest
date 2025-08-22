import express from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/fileController.js";
import { protect } from "../middlewares/authMiddleware.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // unique filename
  },
});
const upload = multer({ storage });

const router = express.Router();

// Fetch files (optionally by folder)
router.route("/").get(protect, getFiles);

// Upload a file to a folder
router.route("/upload").post(protect, upload.single("file"), uploadFile);

// ✅ Delete a file by ID
router.route("/:id").delete(protect, deleteFile);

export default router;
