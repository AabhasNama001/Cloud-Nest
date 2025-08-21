import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Welcome, {user?.name}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Folder */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          className="border p-2 rounded w-64 mr-2"
        />
        <button
          onClick={createFolder}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Folder
        </button>
      </div>

      <h2 className="text-xl mb-4">Folders</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {folders.length > 0 ? (
          folders.map((f) => <FolderCard key={f._id} folder={f} />)
        ) : (
          <p>No folders yet</p>
        )}
      </div>

      <h2 className="text-xl mb-4">Files</h2>
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

export default Dashboard;
