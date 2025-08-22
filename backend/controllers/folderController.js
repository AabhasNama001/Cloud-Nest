import Folder from "../models/Folder.js";
import fs from "fs";
import path from "path";
import File from "../models/File.js";

// Create folder
export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  const folder = await Folder.create({
    name,
    parentId: parentId || null,
    userId: req.user._id,
  });
  res.status(201).json(folder);
};

// Get all user folders
export const getFolders = async (req, res) => {
  const folders = await Folder.find({ userId: req.user._id });
  res.json(folders);
};

export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete folder (and its files)
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Check ownership
    if (folder.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this folder" });
    }

    // Delete all files in this folder
    const files = await File.find({ folderId: folder._id });
    for (const file of files) {
      const filePath = path.join("uploads", file.url.replace("/uploads/", ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await file.deleteOne();
    }

    // Delete folder itself
    await folder.deleteOne();

    res.json({ message: "Folder and its files deleted successfully" });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ message: "Server error" });
  }
};
