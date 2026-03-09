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

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/books", bookRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    res.send("Tomoshelf API running 🚀");
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});