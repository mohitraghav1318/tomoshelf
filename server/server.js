const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoute");
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://tomoshelf.vercel.app/"
        ],
        credentials: true
    })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/books", bookRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Tomoshelf API running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});