/**
 * server/src/middleware/auth.js
 *
 * JWT Authentication & Role-Based Authorization middleware.
 *
 * Usage:
 *   router.get('/me', protect, getMe);
 *   router.delete('/user/:id', protect, authorize('recruiter'), deleteUser);
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect — verifies the Bearer JWT in the Authorization header.
 * Attaches the decoded user object to req.user on success.
 */
export const protect = async (req, res, next) => {
    let token;

    // 1. Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        // 2. Verify signature and expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Fetch fresh user from DB (catches deleted / deactivated accounts)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'The account belonging to this token no longer exists.',
            });
        }

        req.user = user; // attach to request
        next();
    } catch (err) {
        // jwt.verify throws on invalid/expired tokens
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please log in again.',
        });
    }
};

/**
 * authorize(...roles) — restricts a route to specific roles.
 * Must be used AFTER protect.
 *
 * Example:  router.delete('/jobs/:id', protect, authorize('recruiter'), handler)
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not permitted to access this resource.`,
            });
        }
        next();
    };
};
