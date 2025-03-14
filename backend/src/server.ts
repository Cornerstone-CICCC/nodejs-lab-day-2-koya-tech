// Create your serverimport express from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 4500;

// Set up CORS middleware to allow requests from the Astro frontend
app.use(cors({
    origin: 'http://localhost:4321', // Astro frontend port
    credentials: true // allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Register routes
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});