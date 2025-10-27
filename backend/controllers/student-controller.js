const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const Student = require("../models/studentSchema.js");
const Subject = require("../models/subjectSchema.js");

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

const studentRegister = async (req, res) => {
    try {
        const { name, email, password, school, sclassName, rollNum } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email required" });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const student = new Student({ 
            name, 
            email, 
            password, // Will be hashed by pre-save middleware
            school, 
            sclassName, 
            rollNum,
            isVerified: true // For predefined students, set as verified
        });

        const result = await student.save();
        result.password = undefined;
        
        res.status(201).json({ success: true, student: result });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
};

const verifyEmail = async (req, res) => {
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

const setPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student || !student.isVerified) return res.status(400).json({ error: "User not verified" });

        student.password = password; // Will be hashed by pre-save middleware
        await student.save();

        res.json({ success: true, message: "Password set successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to set password" });
    }
};
const studentLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        
        if (!student || !student.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        
        student.password = undefined;
        res.json({ success: true, token, student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};

// export const studentLogIn = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student || !student.password) return res.status(401).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
//     res.json({ success: true, token, student });
//   } catch (err) {
//     res.status(500).json({ error: "Login failed" });
//   }
// };

// Helper function to generate user-friendly password
const generateUserFriendlyPassword = (student) => {
    // Get first name (remove spaces and special characters)
    const firstName = student.name.split(' ')[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
    
    // Get class info (remove spaces and special characters)
    const classInfo = student.sclassName.toString().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    // Generate random 3-digit number
    const randomNum = Math.floor(100 + Math.random() * 900);
    
    // Create password: firstname + class + random number
    const newPassword = `${firstName}${classInfo}${randomNum}`;
    
    return newPassword;
};

const forgotPassword = async (req, res) => {
    console.log('🔍 BACKEND DEBUG - Student Forgot Password endpoint hit');
    console.log('🔍 BACKEND DEBUG - Request body:', req.body);
    
    try {
        const { email } = req.body;
        console.log('🔍 BACKEND DEBUG - Email extracted:', email);
        
        const student = await Student.findOne({ email });
        console.log('🔍 BACKEND DEBUG - Student found:', !!student);
        
        if (!student) {
            console.log('🔍 BACKEND DEBUG - Student not found, returning 404');
            return res.status(404).json({ error: "Email not found" });
        }

        // Generate user-friendly password
        const newPassword = generateUserFriendlyPassword(student);
        console.log('🔍 BACKEND DEBUG - New password generated:', newPassword);

        // Update student password in database
        student.password = newPassword; // Will be hashed by pre-save middleware
        await student.save();
        console.log('🔍 BACKEND DEBUG - Password updated in database');

        // Send email with new password
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c2143; text-align: center;">🔑 Your New Password</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Hello ${student.name},</strong></p>
                    <p>We've generated a new password for your account. You can use this password to login immediately:</p>
                    
                    <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #1976d2; margin: 0; font-size: 24px; letter-spacing: 2px;">${newPassword}</h3>
                    </div>
                    
                    <p><strong>Account Details:</strong></p>
                    <ul style="list-style-type: none; padding: 0;">
                        <li>📧 <strong>Email:</strong> ${student.email}</li>
                        <li>👤 <strong>Name:</strong> ${student.name}</li>
                        <li>🏫 <strong>Class:</strong> ${student.sclassName}</li>
                        <li>🔢 <strong>Roll Number:</strong> ${student.rollNum}</li>
                    </ul>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
                    <p><strong>🔒 Security Note:</strong></p>
                    <p>For your security, please change this password after logging in by going to your profile settings.</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:3000/Studentlogin" style="background-color: #2c2143; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Login Now
                    </a>
                </div>
                
                <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
                    This is an automated email. Please do not reply to this message.
                </p>
            </div>
        `;

        await transporter.sendMail({
            to: student.email,
            subject: "🔑 Your New Password - School Management System",
            html: emailHtml
        });
        console.log('🔍 BACKEND DEBUG - Email sent successfully');

        res.json({ 
            success: true, 
            message: "New password has been sent to your email. You can login immediately with the new password." 
        });
        console.log('🔍 BACKEND DEBUG - Response sent');
    } catch (err) {
        console.error('🚨 BACKEND ERROR - Forgot password error:', err);
        res.status(500).json({ error: "Failed to send reset email", details: err.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const student = await Student.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!student) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        student.password = password; // Will be hashed by pre-save middleware
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;
        await student.save();

        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: "Failed to reset password", details: err.message });
    }
};

const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id }).populate("sclassName", "sclassName");
        students = students.map(s => ({ ...s._doc, password: undefined }));
        res.send(students);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
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

const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            // Password will be hashed by pre-save middleware
            const student = await Student.findById(req.params.id);
            student.password = req.body.password;
            await student.save();
            student.password = undefined;
            res.send(student);
        } else {
            const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
            updated.password = undefined;
            res.send(updated);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id });
        res.send(result.deletedCount > 0 ? result : { message: "No students found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id });
        res.send(result.deletedCount > 0 ? result : { message: "No students found" });
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateExamResult = async (req, res) => {
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

const studentAttendance = async (req, res) => {
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

const clearAllStudentsAttendanceBySubject = async (req, res) => {
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

const clearAllStudentsAttendance = async (req, res) => {
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

const removeStudentAttendanceBySubject = async (req, res) => {
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

const removeStudentAttendance = async (req, res) => {
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

module.exports = {
    studentRegister,
    studentLogIn,
    forgotPassword,
    resetPassword,
    verifyEmail,
    setPassword,
    getStudents,
    getStudentDetail,
    deleteStudents,
    deleteStudent,
    updateStudent,
    studentAttendance,
    deleteStudentsByClass,
    updateExamResult,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance
};
