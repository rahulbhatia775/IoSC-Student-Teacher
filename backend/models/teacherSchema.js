const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const teacherSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    teachSubject: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'subject',
    },
    teachSclass: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    attendance: [{
        date: { type: Date, required: true },
        status: { type: String, enum: ['present', 'absent'], required: true }
    }]
}, { timestamps: true });

// Hash password before saving
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
teacherSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate verification token
teacherSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationToken = hash;
    return token; // return raw token for emailing
};

// Generate reset password token
teacherSchema.methods.generateResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordToken = hash;
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    return token;
};

module.exports = mongoose.model("teacher", teacherSchema)