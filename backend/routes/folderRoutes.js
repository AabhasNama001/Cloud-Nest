import express from "express";
import {
  createFolder,
  getFolderById,
  getFolders,
} from "../controllers/folderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getFolders).post(protect, createFolder);
router.get("/:id", protect, getFolderById);

export default router;
