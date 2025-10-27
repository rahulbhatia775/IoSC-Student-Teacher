require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Routes = require("./routes/route.js"); // routes.js handles teacher routes too
const feedbackRoutes = require('./routes/feedback');
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
app.use('/', Routes);  
// MongoDB connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log("❌ NOT CONNECTED TO NETWORK", err));

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});
