// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");


app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173','https://meeyal-frontend-react.vercel.app'], // your frontend URL
  credentials: true
}));

app.use(express.json());

// Load PORT and MONGO_URI from .env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/v1', routes);




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
