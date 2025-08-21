import React from "react";

const FileCard = ({ file }) => {
  return (
    <div className="bg-green-100 p-4 rounded shadow hover:bg-green-200">
      <div className="text-4xl mb-2">📄</div>
      <div className="font-medium">{file.name}</div>
      <a
        href={`http://localhost:4000${file.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 block"
      >
        Download
      </a>
    </div>
  );
};

export default FileCard;
