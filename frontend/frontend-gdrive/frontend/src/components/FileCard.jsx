import React from "react";

const FileCard = ({ file }) => {
  return (
    <div className="bg-green-800 overflow-auto p-4 rounded shadow hover:bg-gray-600">
      <div className="text-4xl mb-2">📄</div>
      <div className="font-medium">{file.name}</div>
      <a
        href={`http://localhost:4000${file.url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-300 underline mt-2 block hover:text-blue-600 w-fit"
      >
        Open / Download
      </a>
    </div>
  );
};

export default FileCard;
