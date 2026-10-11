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

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const hasClientBuild = fs.existsSync(clientDistPath);

const app = express();

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
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

// Serve static frontend assets and handle SPA routing
if (hasClientBuild) {
  app.use(express.static(clientDistPath));

  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
} else {
  // Default route when running backend without client build
  app.get('/', (req, res) => {
    res.json({ message: 'SkinCycle API is running' });
  });
}

// Error handling middleware
app.use(errorHandler);

export default app;
