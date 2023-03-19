import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from './config/connectdb.js';
import userRoutes from "./routes/userRoutes.js";
import BlogRoutes from "./routes/blogRoutes.js";

const  app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

// cors policy
app.use(cors());

// JSON
app.use(express.json());//sort data into json format

// Connect Database
connectDB(DATABASE_URL);

// Routes
app.use("/api/user", userRoutes)//for security purposes change the path to /api/users

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

app.use("/api/Blog",BlogRoutes);


