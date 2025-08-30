import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes';
import { GameSocketHandler } from './sockets/gameSocket';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));
app.use(express.json());

// Serve static files from docs directory
app.use('/docs', express.static('../../docs'));

// Routes
app.use('/api/games', gameRoutes);

// API Documentation endpoint
app.get('/api-spec', (req, res) => {
  res.sendFile(require('path').join(__dirname, '../../docs/api-spec.yaml'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO handling
const gameSocketHandler = new GameSocketHandler(io);
gameSocketHandler.initialize();

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO enabled for client: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
});

export default app;
