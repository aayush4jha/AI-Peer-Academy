import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";

function SubModuleList() {
  const { moduleName } = useParams();
  const [submodules, setSubmodules] = useState([]);
  const [submoduleNo, setSubmoduleNo] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [newSubmodule, setNewSubmodule] = useState({
    name: "",
    difficulty: "medium",
    isPro: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get("key");

  useEffect(() => {
    fetchsubModules();
  }, [key]);

  const fetchsubModules = async () => {
    try {
      const response = await apiConnector("GET", `/modules/submodules/${key}`);
      setSubmodules(response.data.subModules);
      setSubmoduleNo(response.data.totalSubModules);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch submodules");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/json" || file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a valid JSON or CSV file");
        setSelectedFile(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target);
    setNewSubmodule((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // console.log(newSubmodule);

  const createSubmodule = async (e) => {
    e.preventDefault();

    if (!newSubmodule.name.trim() || !selectedFile) {
      toast.error(
        "Please fill all required fields and upload a questions file"
      );
      return;
    }
    console.log(newSubmodule);
    console.log(typeof newSubmodule.isPro);
    const formData = new FormData();
    formData.append("name", newSubmodule.name);
    formData.append("difficulty", newSubmodule.difficulty);
    formData.append("isPro", newSubmodule.isPro.toString());
    formData.append("moduleId", key);

    formData.append("file", selectedFile);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // try {
    //   await apiConnector("POST", "/admin/sub-modules", {
    //     name: newSubmodule.name,
    //     difficulty: newSubmodule.difficulty,
    //     isPro: newSubmodule.isPro,
    //     moduleId: key,
    //   });
    try {
      console.log("call krne se just phle");
      await apiConnector("POST", `/admin/submodules/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Submodule created successfully");
      fetchsubModules();
      resetForm();
    } catch (error) {
      toast.error("Failed to create submodule");
    }
  };

  const resetForm = () => {
    setNewSubmodule({
      name: "",
      difficulty: "medium",
      isPro: false,
    });
    setSelectedFile(null);
    setShowCreateForm(false);
  };
  const getDifficultyStyles = (difficulty) => {
    const styles = {
      hard: "border-red-500 text-red-500 rounded-2xl",
      easy: "border-green-500 text-green-500",
      medium: "border-yellow-500 text-yellow-500",
    };
    return styles[difficulty?.toLowerCase()] || styles.medium;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{moduleName}</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showCreateForm ? "Cancel" : "Add Submodule"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={createSubmodule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={newSubmodule.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={newSubmodule.difficulty}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPro"
                checked={newSubmodule.isPro}
                onChange={handleInputChange}
                className="rounded"
              />
              <label className="text-sm font-medium">Pro Content</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Questions File (JSON/CSV)
              </label>
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Create Submodule
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {submodules.map((submodule, index) => (
          <div key={submodule._id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{submodule.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <div
                      className={`border-2 p-2 rounded ${getDifficultyStyles(
                        submodule.difficulty
                      )}`}
                    >
                      {submodule?.difficulty?.charAt(0).toUpperCase() +
                        submodule?.difficulty?.slice(1).toLowerCase() ||
                        "Medium"}
                    </div>
                    {submodule.isPro && (
                      <span className="text-sm bg-yellow-200 px-2 py-1 flex justify-center items-center rounded-xl ">
                        Pro
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {submodule.questions?.length || 0} questions
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubModuleList;
