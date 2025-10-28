import { useState } from "react";
import API from "../../api/api";

const TeacherUploadAssignment = () => {
  const [form, setForm] = useState({ subject: "", title: "", classroomLink: "", dueDate: "", uploadedBy: "Teacher A" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/assignments/upload", form);
    alert("Assignment uploaded successfully!");
    setForm({ subject: "", title: "", classroomLink: "", dueDate: "", uploadedBy: "Teacher A" });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Assignment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="text" placeholder="Classroom Link" value={form.classroomLink} onChange={e => setForm({ ...form, classroomLink: e.target.value })} required />
        <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default TeacherUploadAssignment;


// import React, { useState } from "react";
// import axios from "axios";

// const TeacherUploadAssignment = () => {
//   const [file, setFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       alert("Please select a file first!");
//       return;
//     }

//     const formData = new FormData();
//     // ✅ This key must match upload.single("file") in backend
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/assignments/upload",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       alert(res.data.message);
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed!");
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Upload Assignment</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//         />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

// export default TeacherUploadAssignment;

