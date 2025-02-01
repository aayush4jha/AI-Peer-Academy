// SubjectList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");

  const colors = [
    "#F9A8D4",
    "#A7F3D0",
    "#F3E8FF",
    "#BFDBFE",
    "#D1FAE5",
    "#FEE2E2",
  ];

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiConnector("GET", "/dashboard");
      console.log(response)
      setSubjects(response.data.subjects);
    } catch (error) {
      console.log("ERRORR")
      console.log(error)
      toast.error("Failed to fetch subjects");
    }
  };

  const createSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.error("Subject name can't be empty");
      return;
    }

    try {
      const response = await apiConnector("POST", "/admin/subjects", {
        name: newSubjectName,
        description: newSubjectDescription,
      });

      if (response) {
        toast.success("Subject created successfully");
        fetchSubjects();
        setNewSubjectName("");
        setNewSubjectDescription("");
        setShowCreateForm(false);
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to create subject");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subjects</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create New Subject"}
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Subject Name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
          />
          <textarea
            placeholder="Subject Description"
            value={newSubjectDescription}
            onChange={(e) => setNewSubjectDescription(e.target.value)}
            className="w-full p-2 border rounded-md mb-4"
            rows="4"
          />
          <button
            onClick={createSubject}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Subject
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Link
            key={subject._id}
            to={`/admin/courses/${subject.name}?key=${subject._id}`}
            className="block"
          >
            <div
              className="p-6 rounded-lg shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: getRandomColor() }}
            >
              <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>
              <div className="text-sm text-gray-700">
                {subject.modules?.length || 0} modules
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default SubjectList;