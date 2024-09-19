import express from 'express'; //  Import the express library
import dotenv from 'dotenv'; // Import the dotenv library
import cookieParser from 'cookie-parser'; // Import the cookie-parser library


import { connectDb } from './db/connectDb.js';
const app = express();
dotenv.config(); // Load environment variables from the .env file

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(cookieParser()); // Parse incoming cookies


// Import the routes
import auth_routes from './routes/auth_route.js'; 
   
// Use the routes
app.use("/api/auth", auth_routes);

const startServer = async () => {
    try {
        await connectDb(); // Connect to the database
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database or start the server:", error);
    }
};

startServer();
