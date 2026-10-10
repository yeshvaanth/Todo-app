
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/todos", todoRoutes);


app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use((error, req, res, next) => {
  console.error("Application error:", error.message);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
