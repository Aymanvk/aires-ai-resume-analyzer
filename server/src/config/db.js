/**
 * server/src/config/db.js
 *
 * Reusable MongoDB Atlas connection module.
 *
 * Design decisions:
 *  - URI is read ONLY from process.env.MONGO_URI — never hardcoded.
 *  - Connection options are tuned for Atlas (cloud latency, pooling).
 *  - Lifecycle events (connected / disconnected / error / reconnected) are
 *    logged so operators can monitor connectivity without a third-party APM tool.
 *  - On fatal connection failure the process exits with code 1 so the server
 *    never starts in a broken, half-connected state.
 *  - This module is imported only by server.js — the React frontend has NO
 *    reference to it, ensuring the database is never exposed client-side.
 */
import mongoose from 'mongoose';

// ─── Mongoose global settings ─────────────────────────────────────────────────
// Throw an error when a query references a field not defined in the schema.
// Helps catch typos and schema mismatches early in development.
mongoose.set('strictQuery', true);

// ─── Connection lifecycle events ──────────────────────────────────────────────
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose: connection established.');
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  Mongoose: connection lost. Attempting to reconnect…');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose: successfully reconnected to MongoDB Atlas.');
});

mongoose.connection.on('error', (err) => {
    // Non-fatal errors (e.g., a single query that times out) are logged here
    // without crashing the server — the fatal path is handled in connectDB().
    console.error('❌ Mongoose connection error event:', err.message);
});

// ─── connectDB ────────────────────────────────────────────────────────────────
/**
 * Establishes the Mongoose connection to MongoDB Atlas.
 * Called once at startup (in server.js) before the HTTP server binds to a port.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    // Guard: fail loudly if the env var is missing rather than giving a cryptic
    // Mongoose error about an invalid URI.
    if (!uri) {
        console.error(
            '❌ MONGO_URI is not defined in environment variables.\n' +
            '   Copy .env.example → .env and set MONGO_URI to your Atlas connection string.'
        );
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(uri, {
            // ── Atlas-optimised options ──────────────────────────────────────
            // How long the driver waits for a suitable server before giving up.
            // 10 s is generous enough for Atlas cold-start, tight enough to fail
            // quickly during CI/CD pipeline checks.
            serverSelectionTimeoutMS: 10_000,

            // Maximum time a socket can stay idle in the connection pool.
            socketTimeoutMS: 45_000,

            // Connection pool: how many sockets to keep open simultaneously.
            // Good default for a medium-traffic SaaS API.
            maxPoolSize: 10,
            minPoolSize: 2,

            // Silently retry failed writes once (Mongoose 6+ default, kept explicit).
            retryWrites: true,
        });

        const { host, port, name } = conn.connection;
        console.log('✅ MongoDB Atlas connected');
        console.log(`   Host     : ${host}`);
        console.log(`   Port     : ${port}`);
        console.log(`   Database : ${name}`);
    } catch (error) {
        // Fatal — server cannot function without a database connection.
        console.error('❌ MongoDB initial connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
