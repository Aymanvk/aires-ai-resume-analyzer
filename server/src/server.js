/**
 * server/src/server.js
 *
 * HTTP server entry point.
 * - Loads environment variables
 * - Connects to MongoDB
 * - Starts the Express HTTP server
 *
 * Run with:  npm run dev  (inside the server/ directory)
 */
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server.
// If DB connection fails, connectDB() calls process.exit(1) — server won't start.
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 AIRES API server running on http://localhost:${PORT}`);
        console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
        console.log(`   Frontend origin allowed : ${process.env.FRONTEND_ORIGIN}`);
    });

    // Graceful shutdown — close DB connections and ongoing requests cleanly
    const gracefulShutdown = (signal) => {
        console.log(`\n⚠️  Received ${signal}. Gracefully shutting down...`);
        server.close(() => {
            console.log('✅ HTTP server closed.');
            process.exit(0);
        });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Catch any unhandled promise rejections (e.g., a Mongoose query that throws)
    process.on('unhandledRejection', (reason) => {
        console.error('❌ Unhandled Rejection:', reason);
        server.close(() => process.exit(1));
    });
});
