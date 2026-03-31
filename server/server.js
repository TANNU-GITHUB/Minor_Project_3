// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import paperRoutes from './routes/paperRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Node to use Google DNS
const app = express();

// --- NEW: Setup directory pathing for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); 

// --- NEW: Serve the uploads folder publicly ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/papers', paperRoutes);
// MongoDB Connection
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Wait 5 seconds before failing
  family: 4 // Force IPv4 routing (fixes many Node v20 bugs)
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('🚨 MongoDB Connection Error:', err));

// Execute the connection function
connectDB();

// A simple test route to make sure the server is alive
app.get('/', (req, res) => {
  res.send('Lumina-PDF API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});