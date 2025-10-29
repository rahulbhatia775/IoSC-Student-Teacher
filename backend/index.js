require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

<<<<<<< HEAD
const Routes = require("./routes/route.js"); // routes.js handles teacher routes too
const feedbackRoutes = require('./routes/feedback');
=======
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
const notesRoutes = require("./routes/notesRoutes");
const assignmentsRoutes = require("./routes/assignmentsRoutes");

const app = express()
const Routes = require("./routes/route.js")
>>>>>>> 3e0eaca9b773d432e0e11daee5d48e6be8b71e1b
const chatbotRoutes = require('./routes/chatbot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`🔍 REQUEST DEBUG - ${req.method} ${req.path} - Body:`, req.body);
    next();
});

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatbotRoutes);
<<<<<<< HEAD
app.use('/', Routes);  
// MongoDB connection
=======

const PORT = process.env.PORT || 5000

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.use("/api/notes", notesRoutes);
app.use("/api/assignments", assignmentsRoutes);

// mongoose
//     .connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(console.log("Connected to MongoDB"))
//     .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

>>>>>>> 3e0eaca9b773d432e0e11daee5d48e6be8b71e1b
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log("❌ NOT CONNECTED TO NETWORK", err));

<<<<<<< HEAD
app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
=======
app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");




// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// // app.use(express.json({ limit: "10mb" }));

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ NOT CONNECTED TO NETWORK", err));

// // Routes
// app.use("/api/auth", authRoutes);

// // Root
// app.get("/", (req, res) =>
//   res.json({ ok: true, message: "College Portal Backend Running 🚀" })
// );

// // Error handler (must be last)
// app.use(errorHandler);

// // Start server
// app.listen(PORT, () => console.log(`🚀 Server started at port ${PORT}`));
>>>>>>> 3e0eaca9b773d432e0e11daee5d48e6be8b71e1b
