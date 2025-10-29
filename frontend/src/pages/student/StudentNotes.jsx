import { useEffect, useState } from "react";
import API from "../../api/api";

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("/notes").then(res => setNotes(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Notes</h2>
      {notes.map((n) => (
        <div key={n._id}>
          <h4>{n.subject}: {n.title}</h4>
          <a href={n.driveLink} target="_blank" rel="noopener noreferrer">Open Notes</a>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default StudentNotes;
