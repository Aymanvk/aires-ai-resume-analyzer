/**
 * server/src/routes/authRoutes.js
 *
 * Maps HTTP verbs + paths to controllers.
 * Input validation rules are defined inline using express-validator chains.
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// ─── Validation Rule Sets ─────────────────────────────────────────────────────

const registerRules = [
    body('email')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),

    body('role')
        .isIn(['candidate', 'recruiter']).withMessage('Role must be candidate or recruiter'),
];

const loginRules = [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Public routes
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);

// Protected route — requires valid JWT
router.get('/me', protect, getMe);

export default router;
