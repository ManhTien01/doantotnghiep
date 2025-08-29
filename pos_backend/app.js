const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = config.port;
connectDB();

// Middlewares
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.get("/", (req, res) => {
    res.json({ message: "Hello from POS Server!" });
});

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/area", require("./routes/areaRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/reservations", require("./routes/reservationRoute"));
app.use("/api/category", require("./routes/categoryRoute"));
app.use("/api/dishes", require("./routes/dishRoute"));
app.use("/api/ingredients", require("./routes/ingredientRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/metrics", require("./routes/metricsRoutes"));

// Serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Global Error Handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`POS Server is listening on port ${PORT}`);
});
