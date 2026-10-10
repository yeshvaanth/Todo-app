
const API_URL = "http://localhost:5000/api/todos";

export async function getTodos(search = "", status = "") {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const response = await fetch(`${API_URL}?${params.toString()}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch todos");
  }

  return result.data;
}

export async function createTodo(todo) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create todo");
  }

  return result;
}

export async function updateTodo(id, todo) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update todo");
  }

  return result;
}

export async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete todo");
  }

  return result;
}



export async function getTodoById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch todo");
  }

  return result.data;
}

