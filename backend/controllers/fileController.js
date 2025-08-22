import fs from "fs";
import path from "path";
import File from "../models/File.js";

// Upload file
export const uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const { folderId } = req.body;

  try {
    const file = await File.create({
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`, // store relative URL
      folderId: folderId || null,
      userId: req.user._id,
    });

    console.log("✅ Uploaded file:", file);
    res.status(201).json(file);
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ message: "Server error during upload" });
  }
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
    console.error("❌ Get files error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// DELETE file
export const deleteFile = async (req, res) => {
  try {
    console.log("🗑️ Delete request by user:", req.user?._id);
    console.log("🗂️ File id param:", req.params.id);

    const file = await File.findById(req.params.id);
    if (!file) {
      console.log("❌ File not found in DB");
      return res.status(404).json({ message: "File not found" });
    }

    // Extract actual filename from URL (/uploads/xxxx-name.ext)
    const diskName = path.basename(file.url || "");
    const filePath = path.join(process.cwd(), "uploads", diskName);
    console.log("📄 Trying to delete from disk:", filePath);

    // Delete from filesystem
    if (diskName && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("✅ File deleted from disk");
    } else {
      console.log("ℹ️ File not found on disk, skipping unlink");
    }

    // Remove from MongoDB
    await file.deleteOne();
    console.log("✅ File record removed from DB:", req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("🔥 deleteFile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
