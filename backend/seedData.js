const mongoose = require('mongoose');
const Student = require('./models/studentSchema.js');
const Teacher = require('./models/teacherSchema.js');
const Admin = require('./models/adminSchema.js');
const Notice = require('./models/noticeSchema.js');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1/school');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedStudents = async () => {
    try {
        // Clear existing students (optional)
        // await Student.deleteMany({});

        const students = [
            {
                name: "John Doe",
                email: "john.student@school.com",
                password: "student123",
                school: "School Name",
                sclassName: "Class 10A",
                rollNum: "001",
                role: "Student",
                isVerified: true
            },
            {
                name: "Jane Smith",
                email: "jane.student@school.com",
                password: "student123",
                school: "School Name",
                sclassName: "Class 10A",
                rollNum: "002",
                role: "Student",
                isVerified: true
            },
            {
                name: "Mike Johnson",
                email: "mike.student@school.com",
                password: "student123",
                school: "School Name",
                sclassName: "Class 10B",
                rollNum: "003",
                role: "Student",
                isVerified: true
            },
            {
                name: "Mayank Bisht",
                email: "mayankbisht591@gmail.com",
                password: "123456",
                school: "Test School",
                sclassName: "Class 12A",
                rollNum: "004",
                role: "Student",
                isVerified: true
            }
        ];

        for (const studentData of students) {
            const existingStudent = await Student.findOne({ email: studentData.email });
            if (!existingStudent) {
                const student = new Student(studentData);
                await student.save();
                console.log(`Student ${studentData.name} created successfully`);
            } else {
                console.log(`Student ${studentData.name} already exists`);
            }
        }
    } catch (error) {
        console.error('Error seeding students:', error);
    }
};

const seedTeachers = async () => {
    try {
        // Clear existing teachers (optional)
        // await Teacher.deleteMany({});

        const teachers = [
            {
                name: "Prof. Alice Wilson",
                email: "alice.teacher@school.com",
                password: "teacher123",
                role: "Teacher",
                school: "School Name",
                teachSclass: "Class 10A",
                isVerified: true
            },
            {
                name: "Prof. Bob Brown",
                email: "bob.teacher@school.com",
                password: "teacher123",
                role: "Teacher",
                school: "School Name",
                teachSclass: "Class 10B",
                isVerified: true
            },
            {
                name: "Prof. Carol Davis",
                email: "carol.teacher@school.com",
                password: "teacher123",
                role: "Teacher",
                school: "School Name",
                teachSclass: "Class 11A",
                isVerified: true
            },
            {
                name: "Prof. Mayank Bisht",
                email: "mayankbisht591@gmail.com",
                password: "123456",
                role: "Teacher",
                school: "Test School",
                teachSclass: "Class 12A",
                isVerified: true
            }
        ];

        for (const teacherData of teachers) {
            const existingTeacher = await Teacher.findOne({ email: teacherData.email });
            if (!existingTeacher) {
                const teacher = new Teacher(teacherData);
                await teacher.save();
                console.log(`Teacher ${teacherData.name} created successfully`);
            } else {
                console.log(`Teacher ${teacherData.name} already exists`);
            }
        }
    } catch (error) {
        console.error('Error seeding teachers:', error);
    }
};

const seedAdmins = async () => {
    try {
        const admins = [
            {
                name: "Admin John",
                email: "admin@school.com",
                password: "admin123",
                role: "Admin",
                schoolName: "Main School",
                isVerified: true
            },
            {
                name: "Admin Mayank",
                email: "mayankbisht591@gmail.com",
                password: "123456",
                role: "Admin",
                schoolName: "Test School",
                isVerified: true
            },
            {
                name: "Super Admin",
                email: "superadmin@school.com",
                password: "superadmin123",
                role: "Admin",
                schoolName: "Central School",
                isVerified: true
            }
        ];

        for (const adminData of admins) {
            const existingAdmin = await Admin.findOne({ email: adminData.email });
            if (!existingAdmin) {
                const admin = new Admin(adminData);
                await admin.save();
                console.log(`Admin ${adminData.name} created successfully`);
            } else {
                console.log(`Admin ${adminData.name} already exists`);
            }
        }
    } catch (error) {
        console.error('Error seeding admins:', error);
    }
};

const seedNotices = async () => {
    try {
        // Get teachers for notice creation
        const teachers = await Teacher.find().limit(3);
        
        if (teachers.length === 0) {
            console.log('No teachers found for notice seeding');
            return;
        }

        const notices = [
            {
                title: "Important: Mid-term Examination Schedule",
                details: "Mid-term examinations will be conducted from March 15-25, 2024. Please check the detailed schedule on the school website. Students are advised to prepare well and bring all necessary materials.",
                school: "School Name",
                teacher: teachers[0]._id,
                priority: "high"
            },
            {
                title: "Parent-Teacher Meeting",
                details: "Parent-Teacher meeting is scheduled for March 10, 2024, from 10:00 AM to 4:00 PM. Parents are requested to meet their ward's class teacher to discuss academic progress.",
                school: "School Name",
                teacher: teachers[1]._id,
                priority: "medium"
            },
            {
                title: "Science Fair 2024",
                details: "Annual Science Fair will be held on March 20, 2024. Students interested in participating should submit their project proposals by March 5, 2024. Contact your science teacher for more details.",
                school: "School Name",
                teacher: teachers[2]._id,
                priority: "medium"
            },
            {
                title: "Library Books Return Reminder",
                details: "All students who have borrowed books from the library are requested to return them by March 8, 2024. Late returns will incur a fine of Rs. 2 per day.",
                school: "School Name",
                teacher: teachers[0]._id,
                priority: "low"
            },
            {
                title: "Sports Day Announcement",
                details: "Annual Sports Day will be celebrated on March 30, 2024. Practice sessions will start from March 12, 2024. Students interested in participating should register with the sports teacher.",
                school: "School Name",
                teacher: teachers[1]._id,
                priority: "high"
            }
        ];

        for (const noticeData of notices) {
            const existingNotice = await Notice.findOne({ title: noticeData.title });
            if (!existingNotice) {
                const notice = new Notice(noticeData);
                await notice.save();
                console.log(`Notice "${noticeData.title}" created successfully`);
            } else {
                console.log(`Notice "${noticeData.title}" already exists`);
            }
        }
    } catch (error) {
        console.error('Error seeding notices:', error);
    }
};

const seedData = async () => {
    await connectDB();
    
    console.log('Seeding students...');
    await seedStudents();
    
    console.log('Seeding teachers...');
    await seedTeachers();
    
    console.log('Seeding admins...');
    await seedAdmins();
    
    console.log('Seeding notices...');
    await seedNotices();
    
    console.log('Seeding completed!');
    console.log('\nPredefined Login Credentials:');
    console.log('\n--- STUDENTS ---');
    console.log('Email: john.student@school.com | Password: student123');
    console.log('Email: jane.student@school.com | Password: student123');
    console.log('Email: mike.student@school.com | Password: student123');
    console.log('Email: mayankbisht591@gmail.com | Password: 123456 (FOR TESTING FORGOT PASSWORD)');
    console.log('\n--- TEACHERS ---');
    console.log('Email: alice.teacher@school.com | Password: teacher123');
    console.log('Email: bob.teacher@school.com | Password: teacher123');
    console.log('Email: carol.teacher@school.com | Password: teacher123');
    console.log('Email: mayankbisht591@gmail.com | Password: 123456 (FOR TESTING FORGOT PASSWORD)');
    console.log('\n--- ADMINS ---');
    console.log('Email: admin@school.com | Password: admin123');
    console.log('Email: superadmin@school.com | Password: superadmin123');
    console.log('Email: mayankbisht591@gmail.com | Password: 123456 (FOR TESTING FORGOT PASSWORD)');
    
    mongoose.connection.close();
};

if (require.main === module) {
    seedData();
}

module.exports = { seedData };