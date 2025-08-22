import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import { LogOut, FolderPlus } from "lucide-react"; // modern icons

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchData = async () => {
      try {
        const foldersRes = await API.get("/folders");
        setFolders(foldersRes.data);

        const filesRes = await API.get("/files");
        setFiles(filesRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      const res = await API.post("/folders", { name: newFolderName });
      setFolders([...folders, res.data]);
      setNewFolderName("");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Delete handler for files
  const handleDeleteFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
  };

  // ✅ Delete handler for folders
  const handleDeleteFolder = (id) => {
    setFolders((prevFolders) =>
      prevFolders.filter((folder) => folder._id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Welcome, <span className="text-blue-400">{user?.name}</span>
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl shadow-md transition duration-200"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Create Folder */}
      <div className="flex items-center mb-10 bg-gray-800 p-4 rounded-xl shadow-lg w-full max-w-xl">
        <input
          type="text"
          placeholder="Enter new folder name..."
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="flex-1 bg-transparent border-b-2 border-gray-600 focus:border-blue-400 text-lg px-2 py-1 outline-none transition"
        />
        <button
          onClick={createFolder}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 ml-4 rounded-lg transition duration-200"
        >
          <FolderPlus size={18} /> Create
        </button>
      </div>

      {/* Folders Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-blue-400">
          📂 Your Folders
        </h2>
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {folders.map((f) => (
              <div
                key={f._id}
                className="transform hover:scale-105 transition duration-200"
              >
                <FolderCard folder={f} onDelete={handleDeleteFolder} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">
            No folders yet. Create one above!
          </p>
        )}
      </div>

      {/* Files Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-green-400">
          📁 Your Files
        </h2>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((f) => (
              <div
                key={f._id}
                className="transform hover:scale-105 transition duration-200"
              >
                {/* ✅ Pass delete handler */}
                <FileCard file={f} onDelete={handleDeleteFile} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">
            No files yet. Upload or add one!
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
