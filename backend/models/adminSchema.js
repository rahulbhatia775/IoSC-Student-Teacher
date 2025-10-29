const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        default: "Admin"
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    },
    isVerified: { 
        type: Boolean, 
        default: true // Admins are verified by default
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification token
adminSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationToken = hash;
    return token; // return raw token for emailing
};

// Generate reset password token
adminSchema.methods.generateResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordToken = hash;
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return token;
};

module.exports = mongoose.model("admin", adminSchema)