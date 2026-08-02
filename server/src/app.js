import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(mongoSanitize()); // Removed because it crashes in Express 5 by attempting to reassign req.query
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/inventory', inventoryRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'SkinCycle API is running' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
