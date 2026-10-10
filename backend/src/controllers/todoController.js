
const todoService = require("../services/todoService");


async function createTodo(req, res) {
  try {
    const { title, description } = req.body;

    const result = await todoService.createTodo(
      title,
      description
    );

    if (result.success === false) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create todo controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function getAllTodos(req, res) {
  try {
    const { search = "", status = "" } = req.query;

    const result = await todoService.getAllTodos(search, status);

    if (result.success === false) {
      return res.status(result.statusCode || 500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get all todos controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function getTodoById(req, res) {
  try {
    const { id } = req.params;

    const result = await todoService.getTodoById(id);

    if (result.success === false) {
      return res.status(result.statusCode || 500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get todo by ID controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const result = await todoService.updateTodo(
      id,
      title,
      description,
      status
    );

    if (result.success === false) {
      return res.status(result.statusCode || 500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update todo controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


async function deleteTodo(req, res) {
  try {
    const { id } = req.params;

    const result = await todoService.deleteTodo(id);

    if (result.success === false) {
      return res.status(result.statusCode || 500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete todo controller error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};
