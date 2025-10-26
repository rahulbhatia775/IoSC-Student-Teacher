import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  school: { type: String, required: true },
  sclassName: { type: String, required: true },
  rollNum: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  examResult: [
    { subName: { type: String }, marksObtained: { type: Number, default: 0 } },
  ],
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Present", "Absent"], required: true },
      subName: { type: String, required: true },
    },
  ],
});

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification token
studentSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(32).toString("hex");
  return this.verificationToken;
};

// Generate reset password token
studentSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  return token;
};

// ✅ ES Module export
const Student = mongoose.model("Student", studentSchema);
export default Student;
