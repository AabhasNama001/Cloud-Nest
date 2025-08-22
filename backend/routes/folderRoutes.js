import express from "express";
import {
  createFolder,
  getFolderById,
  getFolders,
  deleteFolder,
} from "../controllers/folderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getFolders).post(protect, createFolder);
router.route("/:id").get(protect, getFolderById).delete(protect, deleteFolder);

export default router;
