import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/environment';
import { errorHandler } from './api/middleware/errorHandler';
import { vulnerabilityRoutes } from './api/routes/vulnerabilityRoutes';

const app = express();

// Enable CORS for development
app.use(cors({
  origin: '*',  // Warning: Don't use this in production!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Requested-With']
}));

// Additional CORS headers for pre-flight requests
app.options('*', cors());

app.use(express.json());
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
