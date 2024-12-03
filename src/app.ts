import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import vendorRoutes from './routes/vendorRoutes';
import { errorHandler } from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import cors from "cors"


const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions))
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/vendors', vendorRoutes);
app.use(errorHandler);
export default app;
