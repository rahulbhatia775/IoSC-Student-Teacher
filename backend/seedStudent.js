const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./models/studentSchema");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected", mongoose.connection.name))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const seedStudents = async () => {
  try {
    console.log("Deleting old records...");
    await Student.deleteMany();
    console.log("Old records deleted.");
    

    const students = [
      { name: "Aarav Mehta", email: "mayankbisht591@gmail.com", school: "Sunrise Public School", sclassName: "10A", rollNum: "S001", password: "Password123" },
      { name: "Priya Sharma", email: "priya@example.com", school: "Sunrise Public School", sclassName: "10A", rollNum: "S002", password: "Password123" },
      { name: "Rohan Patel", email: "rohan@example.com", school: "Sunrise Public School", sclassName: "10B", rollNum: "S003", password: "Password123" },
      { name: "Neha Gupta", email: "neha@example.com", school: "Sunrise Public School", sclassName: "10B", rollNum: "S004", password: "Password123" },
      { name: "Karan Singh", email: "karan@example.com", school: "Sunrise Public School", sclassName: "10C", rollNum: "S005", password: "Password123" },
    ];

    const result = await Student.insertMany(students);
    console.log(`✅ ${result.length} students added successfully!`);
  } catch (err) {
    console.error("❌ Error seeding students:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedStudents();
