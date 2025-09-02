import React from "react";
import API from "../services/api"; // <-- use the configured axios instance

const FileCard = ({ file, onDelete }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (loading) return;
    if (!window.confirm(`Delete "${file.name}"?`)) return;

    try {
      setLoading(true);
      await API.delete(`/files/${file._id}`); // <-- token auto-added by interceptor
      onDelete(file._id);
    } catch (error) {
      console.error("Error deleting file:", {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      alert(
        `Failed to delete file${
          error?.response?.status ? ` (HTTP ${error.response.status})` : ""
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  return (
    <div className="bg-green-800 p-4 rounded shadow hover:bg-gray-600 relative">
      <div className="text-4xl mb-2">📄</div>

      <div
        className="font-medium truncate w-full max-w-[200px]"
        title={file.name}
      >
        {file.name}
      </div>

      <a
        href={`${API_URL}${file.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300 underline mt-2 block hover:text-blue-600 w-fit"
      >
        Open / Download
      </a>

      <button
        onClick={handleDelete}
        disabled={loading}
        className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-800"
        }`}
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

export default FileCard;
