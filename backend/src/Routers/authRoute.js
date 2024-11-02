import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User with this username or email already exists
 *       500:
 *         description: Error registering user
 */
router.post('/register', async (req, res) => {
    const { userName, email, password, role } = req.body;

    const validRoles = ['user', 'admin'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role specified" });
    }
    
    try {
        const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role: role || 'user',
            expTokenTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            expRefreshTokenTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userName: user.userName, id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        const newExpTokenTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const newExpRefreshTokenTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hour
        user.expTokenTime = newExpTokenTime;
        user.expRefreshTokenTime = newExpRefreshTokenTime;

        await user.save();

        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour

        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
});

/**
 * @swagger
 * /api/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Access token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Forbidden - Invalid or expired refresh token
 */
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.token;

    if (!refreshToken) return res.sendStatus(403); // Forbidden

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentTime = Date.now();
        if (currentTime > user.expRefreshTokenTime) {
            return res.status(403).json({ message: "Refresh token expired" });
        }

        const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newExpTokenTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const newExpRefreshTokenTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hour
        user.expTokenTime = newExpTokenTime;
        user.expRefreshTokenTime = newExpRefreshTokenTime;

        await user.save();

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Invalid or expired refresh token", error: error.message });
    }
});

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       400:
 *         description: No refresh token provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Error logging out
 */
router.post('/logout', async (req, res) => {
    const refreshToken = req.cookies.token;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.expTokenTime = null;
        user.expRefreshTokenTime = null;

        await user.save();

        res.clearCookie('token');

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error logging out", error: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60c72b2f9b1d4a001d1e9c8c
 *         userName:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           example: password123
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         expTokenTime:
 *           type: string
 *           format: date-time
 *           example: 2024-11-02T15:21:42.926Z
 *         expRefreshTokenTime:
 *           type: string
 *           format: date-time
 *           example: 2024-11-02T15:21:42.926Z
 */

export default router;
