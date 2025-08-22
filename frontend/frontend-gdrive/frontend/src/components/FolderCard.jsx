import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const FolderCard = ({ folder, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent navigating when clicking delete
    try {
      await API.delete(`/folders/${folder._id}`);
      onDelete(folder._id); // update parent state
    } catch (err) {
      console.error("Error deleting folder:", err);
      alert("Failed to delete folder");
    }
  };

  return (
    <div
      className="bg-blue-400 p-4 rounded shadow cursor-pointer hover:bg-gray-700 relative"
      onClick={() => navigate(`/folder/${folder._id}`)}
    >
      <div className="text-4xl mb-2">📁</div>
      <div className="font-medium">{folder.name}</div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-800"
      >
        Delete
      </button>
    </div>
  );
};

export default FolderCard;
