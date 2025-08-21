import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import FileCard from "../components/FileCard";

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
        // Folder info
        const folderRes = await API.get(`/folders/${folderId}`);
        setFolder(folderRes.data);

        // Files inside folder
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">{folder?.name || "Folder"}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex space-x-2">
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Home
        </span>
        {breadcrumb.map((b, idx) => (
          <span key={b.id}>
            /
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate(`/folder/${b.id}`)}
            >
              {b.name}
            </span>
          </span>
        ))}
      </div>

      <div
        className="border-2 border-dashed p-8 mb-6 text-center rounded cursor-pointer"
        onClick={() => document.getElementById("fileInput").click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileToUpload(e.dataTransfer.files[0]);
          }
        }}
      >
        {fileToUpload
          ? fileToUpload.name
          : "Drag & drop file here or click to select"}
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Upload File
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.length > 0 ? (
          files.map((f) => <FileCard key={f._id} file={f} />)
        ) : (
          <p>No files yet</p>
        )}
      </div>
    </div>
  );
};

export default FolderView;
