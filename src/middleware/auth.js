import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. User is not an admin." });
        }

        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        if (user.role !== 'user' && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Please login." });
        }

        req.user = user;
        next();
    });
};
