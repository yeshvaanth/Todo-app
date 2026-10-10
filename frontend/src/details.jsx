
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getTodoById } from "./api";
import "./index.css";

function TodoDetails() {
  const params = new URLSearchParams(window.location.search);
  const todoId = params.get("id");

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTodo() {
      if (!todoId || !/^\d+$/.test(todoId) || Number(todoId) < 1) {
        setError("Please provide a valid todo ID.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTodoById(todoId);
        setTodo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTodo();
  }, [todoId]);

  if (loading) {
    return (
      <main className="page">
        <p className="message">Loading todo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <a className="back-link" href="/">← Back to Todos</a>
        <p className="error-message">{error}</p>
      </main>
    );
  }

  if (!todo) return null;

  const statusLabel = {
    pending: "Pending",
    in_progress: "In progress",
    completed: "Completed",
  };

  return (
    <main className="page">
      <a className="back-link" href="/">← Back to Todos</a>

      <header className="details-header">
        <div>
          <p className="eyebrow">TASK DETAILS</p>
          <h1>{todo.title}</h1>
        </div>

        <span className={`status-badge badge-${todo.status}`}>
          {statusLabel[todo.status] || todo.status}
        </span>
      </header>

      <section className="details-card">
        <h2>Description</h2>
        <p className="details-description">
          {todo.description || "No description provided."}
        </p>

        <div className="details-divider" />

        <div className="details-field">
          <span>Todo ID</span>
          <strong>{todo.id}</strong>
        </div>

        <div className="details-field">
          <span>Status</span>
          <strong>{statusLabel[todo.status] || todo.status}</strong>
        </div>

        <div className="details-field">
          <span>Created at</span>
          <strong>
            {todo.created_at
              ? new Date(todo.created_at).toLocaleString()
              : "Not available"}
          </strong>
        </div>

        <div className="details-field">
          <span>Last updated</span>
          <strong>
            {todo.updated_at
              ? new Date(todo.updated_at).toLocaleString()
              : "Not available"}
          </strong>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<TodoDetails />);
