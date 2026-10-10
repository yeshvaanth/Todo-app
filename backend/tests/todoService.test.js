
const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const pool = require("../src/config/db");
const todoService = require("../src/services/todoService");

const sampleTodo = {
  id: 1,
  title: "Learn Express.js",
  description: "Build CRUD APIs",
  status: "pending",
  created_at: new Date("2026-01-01T10:00:00Z"),
  updated_at: new Date("2026-01-01T10:00:00Z"),
};

describe("createTodo", () => {
  test("should reject a missing title", async (t) => {
    t.mock.method(pool, "execute");

    const result = await todoService.createTodo("", "Description");

    assert.equal(result.success, false);
    assert.equal(result.message, "Todo title is required");
    assert.equal(result.statusCode, 400);
    assert.equal(pool.execute.mock.calls.length, 0);
  });

  test("should reject a whitespace-only title", async () => {
    const result = await todoService.createTodo("   ", "Description");

    assert.equal(result.success, false);
    assert.match(result.message, /title is required/i);
    assert.equal(result.statusCode, 400);
  });

  test("should reject a title longer than 150 characters", async () => {
    const result = await todoService.createTodo(
      "a".repeat(151),
      "Description"
    );

    assert.equal(result.success, false);
    assert.match(result.message, /150 characters/i);
    assert.equal(result.statusCode, 400);
  });

  test("should create a todo successfully", async (t) => {
    t.mock.method(pool, "execute", async () => [
      { insertId: 1 },
      [],
    ]);

    const result = await todoService.createTodo(
      "Learn Express.js",
      "Build CRUD APIs"
    );

    assert.equal(result.success, true);
    assert.equal(result.message, "Todo created successfully");
    assert.deepEqual(result.data, { id: 1 });

    assert.deepEqual(pool.execute.mock.calls[0].arguments[1], [
      "Learn Express.js",
      "Build CRUD APIs",
    ]);
  });

  test("should handle a database error", async (t) => {
    t.mock.method(pool, "execute", async () => {
      throw new Error("Database error");
    });

    const result = await todoService.createTodo(
      "Learn Express.js",
      "Build CRUD APIs"
    );

    assert.equal(result.error, "Failed to create todo");
    assert.equal(result.statusCode, 500);
  });
});

describe("getAllTodos", () => {
  test("should return all todos", async (t) => {
    t.mock.method(pool, "execute", async () => [
      [sampleTodo],
      [],
    ]);

    const result = await todoService.getAllTodos();

    assert.equal(result.success, true);
    assert.equal(result.data.length, 1);
    assert.equal(result.data[0].title, "Learn Express.js");
  });

  test("should apply search and status filters", async (t) => {
    t.mock.method(pool, "execute", async () => [
      [sampleTodo],
      [],
    ]);

    const result = await todoService.getAllTodos(
      "Express",
      "pending"
    );

    assert.equal(result.success, true);

    assert.deepEqual(pool.execute.mock.calls[0].arguments[1], [
      "%Express%",
      "pending",
      "pending",
    ]);
  });

  test("should return an empty list when no todos match", async (t) => {
    t.mock.method(pool, "execute", async () => [[], []]);

    const result = await todoService.getAllTodos();

    assert.equal(result.success, true);
    assert.equal(result.message, "No todos found");
    assert.deepEqual(result.data, []);
  });

  test("should handle a database error", async (t) => {
    t.mock.method(pool, "execute", async () => {
      throw new Error("Database error");
    });

    const result = await todoService.getAllTodos();

    assert.equal(result.success, false);
    assert.equal(result.statusCode, 500);
  });
});

describe("getTodoById", () => {
  test("should reject an invalid ID", async (t) => {
    t.mock.method(pool, "execute");

    const result = await todoService.getTodoById("abc");

    assert.equal(result.success, false);
    assert.equal(result.message, "Invalid todo ID");
    assert.equal(result.statusCode, 400);
  });

  test("should return a todo by ID", async (t) => {
    t.mock.method(pool, "execute", async () => [
      [sampleTodo],
      [],
    ]);

    const result = await todoService.getTodoById(1);

    assert.equal(result.success, true);
    assert.equal(result.data.id, 1);
    assert.equal(result.data.title, "Learn Express.js");
  });

  test("should return not found when the todo does not exist", async (t) => {
    t.mock.method(pool, "execute", async () => [[], []]);

    const result = await todoService.getTodoById(999);

    assert.equal(result.success, false);
    assert.equal(result.message, "Todo not found");
    assert.equal(result.statusCode, 404);
  });
});

describe("updateTodo", () => {
  test("should update a todo successfully", async (t) => {
    const updatedTodo = {
      ...sampleTodo,
      title: "Learn Node.js",
      description: "Practice APIs",
      status: "in_progress",
    };

    let callCount = 0;

    t.mock.method(pool, "execute", async () => {
      callCount += 1;

      if (callCount === 1) {
        return [[{ id: 1 }], []];
      }

      if (callCount === 2) {
        return [{ affectedRows: 1 }, []];
      }

      return [[updatedTodo], []];
    });

    const result = await todoService.updateTodo(
      1,
      "Learn Node.js",
      "Practice APIs",
      "in_progress"
    );

    assert.equal(result.success, true);
    assert.equal(result.message, "Todo updated successfully");
    assert.equal(result.data.title, "Learn Node.js");
    assert.equal(result.data.status, "in_progress");
    assert.equal(callCount, 3);
  });

  test("should reject an invalid ID", async (t) => {
    t.mock.method(pool, "execute");

    const result = await todoService.updateTodo(
      0,
      "Learn Node.js",
      "Practice APIs",
      "pending"
    );

    assert.equal(result.success, false);
    assert.equal(result.message, "Invalid todo ID");
    assert.equal(result.statusCode, 400);
  });

  test("should reject a missing title", async () => {
    const result = await todoService.updateTodo(
      1,
      "",
      "Practice APIs",
      "pending"
    );

    assert.equal(result.success, false);
    assert.equal(result.message, "Todo title is required");
    assert.equal(result.statusCode, 400);
  });

  test("should reject an invalid status", async (t) => {
    t.mock.method(pool, "execute");

    const result = await todoService.updateTodo(
      1,
      "Learn Node.js",
      "Practice APIs",
      "invalid"
    );

    assert.equal(result.success, false);
    assert.equal(result.message, "Invalid todo status");
    assert.equal(result.statusCode, 400);
  });

  test("should return not found when updating a missing todo", async (t) => {
    t.mock.method(pool, "execute", async () => [[], []]);

    const result = await todoService.updateTodo(
      999,
      "Learn Node.js",
      "Practice APIs",
      "pending"
    );

    assert.equal(result.success, false);
    assert.equal(result.message, "Todo not found");
    assert.equal(result.statusCode, 404);
  });
});

describe("deleteTodo", () => {
  test("should delete a todo successfully", async (t) => {
    let callCount = 0;

    t.mock.method(pool, "execute", async () => {
      callCount += 1;

      if (callCount === 1) {
        return [[{ id: 1 }], []];
      }

      return [{ affectedRows: 1 }, []];
    });

    const result = await todoService.deleteTodo(1);

    assert.equal(result.success, true);
    assert.equal(result.message, "Todo deleted successfully");
    assert.equal(callCount, 2);
  });

  test("should reject an invalid ID", async (t) => {
    t.mock.method(pool, "execute");

    const result = await todoService.deleteTodo(-1);

    assert.equal(result.success, false);
    assert.equal(result.message, "Invalid todo ID");
    assert.equal(result.statusCode, 400);
  });

  test("should return not found when deleting a missing todo", async (t) => {
    t.mock.method(pool, "execute", async () => [[], []]);

    const result = await todoService.deleteTodo(999);

    assert.equal(result.success, false);
    assert.equal(result.message, "Todo not found");
    assert.equal(result.statusCode, 404);
  });
});
