/**
 * server/src/controllers/authController.js
 *
 * Handles authentication logic for AIRES
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const signToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const authResponse = (res, statusCode, user, token) => {
    return res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
};

// ─── Controllers ────────────────────────────────────────────────────────────

/**
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
    console.log("🔥 REGISTER CONTROLLER CALLED");

    // 1️⃣ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ Validation failed:', errors.array());
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { email, password, role } = req.body;

    try {
        // 2️⃣ Check for existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            console.log('⚠️  User already exists:', email);
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists.',
            });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 4️⃣ Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        });

        console.log('✅ USER SAVED:', user.email);

        // 5️⃣ Issue token
        const token = signToken(user);
        return authResponse(res, 201, user, token);

    } catch (error) {
        console.error('🔥 Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
};

/**
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
    console.log('➡️  LOGIN HIT:', req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { email, password } = req.body;
    const INVALID_MSG = 'Invalid email or password.';

    try {
        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: INVALID_MSG });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: INVALID_MSG });
        }

        const token = signToken(user);
        return authResponse(res, 200, user, token);

    } catch (error) {
        console.error('🔥 Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
};

/**
 * @route GET /api/auth/me
 */
export const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            createdAt: req.user.createdAt,
        },
    });
};