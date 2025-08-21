import Folder from "../models/Folder.js";

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
