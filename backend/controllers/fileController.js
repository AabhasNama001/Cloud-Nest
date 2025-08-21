import File from "../models/File.js";
import path from "path";

// Upload file
export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const { folderId } = req.body;

  const file = await File.create({
    name: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    folderId: folderId || null,
    userId: req.user._id,
  });

  res.status(201).json(file);
};

// Get all files
export const getFiles = async (req, res) => {
  try {
    const { folderId } = req.query;
    const filter = { userId: req.user._id };
    if (folderId) filter.folderId = folderId;

    const files = await File.find(filter);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
