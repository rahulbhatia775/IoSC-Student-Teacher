import { useState } from "react";
import API from "../../api/api";

const TeacherUploadNotes = () => {
  const [form, setForm] = useState({ subject: "", title: "", driveLink: "", uploadedBy: "Teacher A" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/notes/upload", form);
    alert("Note uploaded successfully!");
    setForm({ subject: "", title: "", driveLink: "", uploadedBy: "Teacher A" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Notes</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder="Drive Link" value={form.driveLink} onChange={e => setForm({ ...form, driveLink: e.target.value })} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default TeacherUploadNotes;
