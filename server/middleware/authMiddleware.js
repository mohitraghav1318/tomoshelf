const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401);
        return next(new Error("No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded.id;

        next();
    } catch (error) {
        res.status(401);
        next(new Error("Invalid token"));
    }
};

module.exports = authMiddleware;