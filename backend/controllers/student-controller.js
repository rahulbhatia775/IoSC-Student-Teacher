import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Student from "../models/studentSchema.js";
import Subject from "../models/subjectSchema.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (student, req) => {
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const url = `${req.protocol}://${req.get("host")}/api/student/verify/${token}`;
  await transporter.sendMail({
    to: student.email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
};

export const studentRegister = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });

    let student = await Student.findOne({ email });
    if (!student) {
      student = new Student({ name, email });
      await student.save();
    }

    await sendVerificationEmail(student, req);
    res.json({ success: true, message: "Verification email sent" });
  } catch (err) {

  console.error("Registration error:", err);
  res.status(500).json({ error: "Registration failed", details: err.message });


  }
};

export const verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(400).json({ error: "Invalid token" });

    student.isVerified = true;
    await student.save();

    res.json({ success: true, message: "Email verified. Please set your password." });
  } catch (err) {
    res.status(500).json({ error: "Email verification failed" });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !student.isVerified) return res.status(400).json({ error: "User not verified" });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    await student.save();

    res.json({ success: true, message: "Password set successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to set password" });
  }
};

export const studentLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student || !student.password) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token, student });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Email not found" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const url = `${req.protocol}://${req.get("host")}/api/student/reset-password/${token}`;

    await transporter.sendMail({
      to: student.email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
    });

    res.json({ success: true, message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) return res.status(400).json({ error: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);
    await student.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset password" });
  }
};

export const getStudents = async (req, res) => {
  try {
    let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
    students = students.map(s => ({ ...s._doc, password: undefined }));
    res.send(students);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getStudentDetail = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("school", "schoolName")
      .populate("sclassName", "sclassName")
      .populate("examResult.subName", "subName")
      .populate("attendance.subName", "subName sessions");

    if (student) {
      student.password = undefined;
      res.send(student);
    } else {
      res.send({ message: "No student found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateStudent = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updated.password = undefined;
    res.send(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteStudents = async (req, res) => {
  try {
    const result = await Student.deleteMany({ school: req.params.id });
    res.send(result.deletedCount > 0 ? result : { message: "No students found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteStudentsByClass = async (req, res) => {
  try {
    const result = await Student.deleteMany({ sclassName: req.params.id });
    res.send(result.deletedCount > 0 ? result : { message: "No students found" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateExamResult = async (req, res) => {
  try {
    const { subName, marksObtained } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.send({ message: "Student not found" });

    const existingResult = student.examResult.find(r => r.subName.toString() === subName);
    if (existingResult) existingResult.marksObtained = marksObtained;
    else student.examResult.push({ subName, marksObtained });

    const result = await student.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const studentAttendance = async (req, res) => {
  try {
    const { subName, status, date } = req.body;
    const student = await Student.findById(req.params.id);
    const subject = await Subject.findById(subName);

    if (!student) return res.send({ message: "Student not found" });

    const existing = student.attendance.find(a =>
      a.date.toDateString() === new Date(date).toDateString() &&
      a.subName.toString() === subName
    );

    if (existing) existing.status = status;
    else {
      const attended = student.attendance.filter(a => a.subName.toString() === subName).length;
      if (attended >= subject.sessions) return res.send({ message: "Maximum attendance limit reached" });
      student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const clearAllStudentsAttendanceBySubject = async (req, res) => {
  try {
    const subName = req.params.id;
    const result = await Student.updateMany(
      { 'attendance.subName': subName },
      { $pull: { attendance: { subName } } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const clearAllStudentsAttendance = async (req, res) => {
  try {
    const schoolId = req.params.id;
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const removeStudentAttendanceBySubject = async (req, res) => {
  try {
    const studentId = req.params.id;
    const subName = req.body.subId;

    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName } } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const removeStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } }
    );
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
