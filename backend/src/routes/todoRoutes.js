
const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todoController");

// Create a todo
router.post("/", todoController.createTodo);

// Get all todos
router.get("/", todoController.getAllTodos);

// Get a single todo
router.get("/:id", todoController.getTodoById);

// Update a todo
router.put("/:id", todoController.updateTodo);

// Delete a todo
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
