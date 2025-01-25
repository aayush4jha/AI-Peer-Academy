import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";

const ModuleList = () => {
  const { courseName } = useParams();
  const [modules, setModules] = useState([]);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get("key");

  useEffect(() => {
    fetchModules();
  }, [courseName]);

  const fetchModules = async () => {
    try {
      const response = await apiConnector("GET", `/courses/${courseName}`);
      setModules(response.data.modules);
      console.log(response.data.modules);
    } catch (error) {
      toast.error("Failed to fetch modules");
    }
  };

  const createModule = async () => {
    if (!newModuleName.trim() || !key) {
      toast.error("Module name can't be empty or missing key");
      return;
    }

    try {
      await apiConnector("POST", `/admin/modules`, {
        name: newModuleName,
        subjectId: key,
      });
      toast.success("Module created successfully");
      fetchModules();
      setNewModuleName("");
      setShowCreateModule(false);
    } catch (error) {
      toast.error("Failed to create module");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{courseName}</h1>
        <button
          onClick={() => setShowCreateModule(!showCreateModule)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showCreateModule ? "Cancel" : "Add Module"}
        </button>
      </div>

      {showCreateModule && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Module Name"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            onClick={createModule}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Create Module
          </button>
        </div>
      )}

      <div className="space-y-8">
        {modules.map((module, index) => (
          <Link
            to={`/admin/courses/modules/${module.name}?key=${module.id}`}
            className="text-xl font-semibold text-blue-600 hover:underline"
          >
            <div key={module._id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {module.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;
