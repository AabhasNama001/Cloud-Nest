import React from "react";

const FileCard = ({ file }) => {
  return (
    <a
      href={`http://localhost:4000${file.url}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-green-800 p-4 rounded shadow hover:bg-gray-600">
        <div className="text-4xl mb-2">📄</div>
        <div className="font-medium truncate w-full max-w-[200px]">
          {file.name}
        </div>
        <span className="text-blue-300 underline mt-2 block hover:text-blue-600 w-fit">
          Open / Download
        </span>
      </div>{" "}
    </a>
  );
};

export default FileCard;
