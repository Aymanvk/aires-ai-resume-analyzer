/**
 * server/src/models/User.js
 *
 * MongoDB User schema via Mongoose.
 *
 * Stored fields:
 *   email        — unique identifier, normalised to lowercase
 *   password     — bcrypt hash ONLY (plain text is NEVER stored)
 *   role         — 'candidate' | 'recruiter' (least-privilege principle)
 *   createdAt    — auto-managed by Mongoose timestamps
 *   updatedAt    — auto-managed by Mongoose timestamps
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,      // normalise before storing
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            // select: false → password is NOT returned in any query by default.
            // Controllers that need it must explicitly opt-in with .select('+password')
            select: false,
        },

        role: {
            type: String,
            enum: {
                values: ['candidate', 'recruiter'],
                message: 'Role must be either candidate or recruiter',
            },
            required: [true, 'Role is required'],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const User = mongoose.model('User', userSchema);

export default User;
