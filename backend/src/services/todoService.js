
const pool = require("../config/db");

async function createTodo(title, description) {
  try {
  
    if (!title || typeof title !== "string" || !title.trim()) {
        return {
            success: false,
            message: "Todo title is required",
            statusCode: 400,
        };
    }

  
    if (title.trim().length > 150) {
    return {
        success: false,
        message: "Title cannot exceed 150 characters",
        statusCode: 400,
    };
    }


    const sql = `INSERT INTO todos (title, description) VALUES (?, ?)`;

    const [result] = await pool.execute(sql, [
      title.trim(),
      description || null,
    ]);

    return {
        success: true,
        message: "Todo created successfully",
        data: {
            id: result.insertId,
        },
    };
    
  } catch (error) {
    console.error("Create todo service error:", error.message);

    return {
      error: "Failed to create todo",
      statusCode: 500,
    };
  }
}




async function getAllTodos(search = "", status = "") {
  try {
    const sql = `SELECT * FROM todos  WHERE title LIKE ? AND (? = '' OR status = ?) ORDER BY created_at DESC`;

    const searchTerm = `%${search.trim()}%`;

    const [todos] = await pool.execute(sql, [
      searchTerm,
      status,
      status,
    ]);

    

    return {
      success: true,
      message: todos.length === 0
        ? "No todos found"
        : "Todos retrieved successfully",
      data: todos,
    };
  } catch (error) {
    console.error("Get all todos service error:", error.message);

    return {
      success: false,
      message: "Failed to retrieve todos",
      statusCode: 500,
    };
  }
}



async function getTodoById(id) {
  try {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return {
        success: false,
        message: "Invalid todo ID",
        statusCode: 400,
      };
    }
    const sql = `SELECT * FROM todos WHERE id = ?`;

    const [todos] = await pool.execute(sql, [Number(id)]);

    if (todos.length === 0) {
      return {
        success: false,
        message: "Todo not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "Todo retrieved successfully",
      data: todos[0],
    };

  } catch (error) {
    console.error("Get todo by ID service error:", error.message);

    return {
      success: false,
      message: "Failed to retrieve todo",
      statusCode: 500,
    };
  }
}



async function updateTodo(id, title, description, status) {
  try {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return {
        success: false,
        message: "Invalid todo ID",
        statusCode: 400,
      };
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return {
        success: false,
        message: "Todo title is required",
        statusCode: 400,
      };
    }

    if (title.trim().length > 150) {
      return {
        success: false,
        message: "Title cannot exceed 150 characters",
        statusCode: 400,
      };
    }

    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return {
        success: false,
        message: "Invalid todo status",
        statusCode: 400,
      };
    }


    const [existingTodos] = await pool.execute("SELECT id FROM todos WHERE id = ?",[Number(id)]);

    if (existingTodos.length === 0) {
      return {
        success: false,
        message: "Todo not found",
        statusCode: 404,
      };
    }

    const sql = `UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?`;

    await pool.execute(sql, [
      title.trim(),
      description || null,
      status,
      Number(id),
    ]);

    const [updatedTodos] = await pool.execute("SELECT * FROM todos WHERE id = ?", [Number(id)]);

    return {
        success: true,
        message: "Todo updated successfully",
        data: updatedTodos[0],
    };

  } catch (error) {
    console.error("Update todo service error:", error.message);

    return {
      success: false,
      message: "Failed to update todo",
      statusCode: 500,
    };
  }
}



async function deleteTodo(id) {
  try {

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return {
        success: false,
        message: "Invalid todo ID",
        statusCode: 400,
      };
    }

    const [todos] = await pool.execute( "SELECT id FROM todos WHERE id = ?",[Number(id)]);

    if (todos.length === 0) {
      return {
        success: false,
        message: "Todo not found",
        statusCode: 404,
      };
    }

    const sql = "DELETE FROM todos WHERE id = ?";

    await pool.execute(sql, [Number(id)]);

    return {
      success: true,
      message: "Todo deleted successfully",
    };
  } catch (error) {
    console.error("Delete todo service error:", error.message);

    return {
      success: false,
      message: "Failed to delete todo",
      statusCode: 500,
    };
  }
}


module.exports = { createTodo,getAllTodos,getTodoById,updateTodo,deleteTodo};
