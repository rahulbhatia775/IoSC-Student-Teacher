import { useEffect, useState } from "react";
import API from "../../api/api";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    API.get("/assignments").then(res => setAssignments(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Assignments</h2>
      {assignments.map((a) => (
        <div key={a._id}>
          <h4>{a.subject}: {a.title}</h4>
          <p>Due Date: {new Date(a.dueDate).toLocaleDateString()}</p>
          <a href={a.classroomLink} target="_blank" rel="noopener noreferrer">Go to Classroom</a>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default StudentAssignments;
