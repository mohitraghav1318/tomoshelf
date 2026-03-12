//error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("errorHandler received:", err); // log the raw value
    console.error(err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error",
    });
};

module.exports = errorHandler;