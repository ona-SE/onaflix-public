import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './shared/config/database';
import logger from './shared/utils/logger';

// Import routes
import contentRoutes from './catalog/routes/contentRoutes';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/content', contentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        logger.info('Database connection established');
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        logger.error('Error during database initialization:', error);
        process.exit(1);
    }); 