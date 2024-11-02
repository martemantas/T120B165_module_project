import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

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

        res.cookie('__vercel_live_token', token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None' 
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

export default router;
