import React from "react";
import { useNavigate } from "react-router-dom";

const FolderCard = ({ folder }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="bg-blue-400 p-4 rounded shadow cursor-pointer hover:bg-gray-700"
      onClick={() => navigate(`/folder/${folder._id}`)}
    >
      <div className="text-4xl mb-2">📁</div>
      <div className="font-medium">{folder.name}</div>
    </div>
  );
};

export default FolderCard;
