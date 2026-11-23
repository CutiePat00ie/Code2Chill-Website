require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const contactRoutes = require('./routes/contactRoutes');
const joinRoutes = require('./routes/joinRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware setup
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    club: 'Code2Chill (C2C)',
    version: '1.0.0',
    mode: global.USE_MEMORY_DB ? 'In-Memory Store (Active & Ready)' : 'MongoDB Atlas / Local',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/join', joinRoutes);
app.use('/api/stats', statsRoutes);

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc; min-height: 100vh;">
        <h1 style="color: #38bdf8;">⚡ Code2Chill (C2C) Backend API</h1>
        <p>Student-Led Technical Club API is running successfully!</p>
        <p>Explore endpoints:</p>
        <ul>
          <li><a style="color: #a78bfa;" href="/api/health">/api/health</a> - Health check</li>
          <li><a style="color: #a78bfa;" href="/api/events">/api/events</a> - Events & Hackathons</li>
          <li><a style="color: #a78bfa;" href="/api/projects">/api/projects</a> - Student Projects</li>
          <li><a style="color: #a78bfa;" href="/api/team">/api/team</a> - Core Team & Leads</li>
          <li><a style="color: #a78bfa;" href="/api/stats">/api/stats</a> - Club Metrics</li>
          <li><a style="color: #a78bfa;" href="/api/stats/domains">/api/stats/domains</a> - Tech Domains</li>
        </ul>
      </div>
    `);
  });
}

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Code2Chill (C2C) Server running on http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Database: ${global.USE_MEMORY_DB ? 'In-Memory Store (Zero Config Ready)' : 'MongoDB Connected'}`);
    console.log(`======================================================\n`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
