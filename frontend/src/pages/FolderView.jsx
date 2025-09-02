import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import FileCard from "../components/FileCard";
import { LogOut, UploadCloud } from "lucide-react"; // modern icons
import { toast } from "react-toastify";

const FolderView = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id: folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchData = async () => {
      try {
        const folderRes = await API.get(`/folders/${folderId}`);
        setFolder(folderRes.data);

        const filesRes = await API.get(`/files?folderId=${folderId}`);
        setFiles(filesRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [folderId, user]);

  const handleFileChange = (e) => setFileToUpload(e.target.files[0]);

  const handleUpload = async () => {
    if (!fileToUpload) return;
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("folderId", folderId);
    toast.success("File uploaded");

    try {
      const res = await API.post("/files/upload", formData);
      setFiles([...files, res.data]);
      setFileToUpload(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFolderAndBreadcrumb = async () => {
      try {
        let currentFolderId = folderId;
        let crumbs = [];
        while (currentFolderId) {
          const res = await API.get(`/folders/${currentFolderId}`);
          crumbs.unshift({ id: res.data._id, name: res.data.name });
          currentFolderId = res.data.parentId;
        }
        setBreadcrumb(crumbs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFolderAndBreadcrumb();
  }, [folderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide">
          {folder?.name || "Folder"}
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl shadow-md transition duration-200"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-gray-300 text-lg">
        <span
          className="text-blue-400 cursor-pointer hover:underline"
          onClick={() => navigate("/dashboard")}
        >
          Home
        </span>
        {breadcrumb.map((b, idx) => (
          <span key={b.id} className="flex items-center gap-2">
            <span className="text-gray-500">/</span>
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate(`/folder/${b.id}`)}
            >
              {b.name}
            </span>
          </span>
        ))}
      </div>

      {/* Drag & Drop Upload */}
      <div
        className="border-2 border-dashed border-gray-600 hover:border-blue-400 transition p-10 mb-8 text-center rounded-2xl bg-gray-800/50 cursor-pointer shadow-lg"
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileToUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        {fileToUpload ? (
          <p className="text-green-400 font-medium">{fileToUpload.name}</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <UploadCloud size={40} className="text-blue-400" />
            <p className="text-lg">
              Drag & drop file here or{" "}
              <span className="text-blue-400 underline">click to select</span>
            </p>
          </div>
        )}
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-md mb-10 transition duration-200"
      >
        <UploadCloud size={20} /> Upload File
      </button>

      {/* Files Grid */}
      <h2 className="text-2xl font-semibold mb-6 text-green-400">📁 Files</h2>
      {files.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((f) => (
            <div
              key={f._id}
              className="transform hover:scale-105 transition duration-200"
            >
              <FileCard file={f} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No files yet in this folder.</p>
      )}
    </div>
  );
};

export default FolderView;
