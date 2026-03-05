/**
 * server/src/app.js
 *
 * Express application configuration.
 * Wires together all security middleware, routes, and error handlers.
 * Does NOT start the HTTP server — that is done in server.js.
 */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';

const app = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
// helmet sets 14 security-focused HTTP response headers automatically
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Only the specified frontend origin may call this API.
// In production, set FRONTEND_ORIGIN to your deployed frontend URL.
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
// Limit request body size to prevent large-payload DoS attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Aggressive limit on auth endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 10,                   // max 10 requests per window per IP
    standardHeaders: true,     // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
    },
});

// General API rate limiter (more lenient)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter); // stricter limit on auth routes

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'AIRES API is running.' });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('[GlobalError]', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected server error occurred.',
    });
});

export default app;
