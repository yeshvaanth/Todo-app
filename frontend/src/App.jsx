
import { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./api";
import "./index.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal state
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // FETCH TODOS
  async function loadTodos() {
    try {
      setLoading(true);
      setError("");

      const data = await getTodos(search, status);
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, [search, status]);

  // CREATE TODO
  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Todo title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createTodo({
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
      setShowForm(false);

      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // TOGGLE COMPLETION
  async function handleToggle(todo) {
    const nextStatus =
      todo.status === "completed" ? "pending" : "completed";

    try {
      setError("");

      await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description || "",
        status: nextStatus,
      });

      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  // OPEN EDIT SCREEN
  function handleEdit(todo) {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description || "",
      status: todo.status,
    });

    setShowForm(false);
    setError("");
  }

  // UPDATE TODO
  async function handleUpdate(event) {
    event.preventDefault();

    if (!editingTodo.title.trim()) {
      setError("Todo title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateTodo(editingTodo.id, {
        title: editingTodo.title.trim(),
        description: editingTodo.description.trim(),
        status: editingTodo.status,
      });

      setEditingTodo(null);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // CANCEL EDIT
  function handleCancelEdit() {
    setEditingTodo(null);
    setError("");
  }

  // OPEN DELETE CONFIRMATION MODAL
  function handleDeleteClick(todo) {
    setError("");
    setTodoToDelete(todo);
  }

  // CONFIRM AND DELETE TODO
  async function confirmDelete() {
    if (!todoToDelete || deleting) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTodo(todoToDelete.id);

      setTodoToDelete(null);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  // SORT TODOS
  const sortedTodos = [...todos].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    return sort === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });

  const tabs = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "In progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
  ];

  // CREATE SCREEN
  if (showForm) {
    return (
      <main className="page edit-page">
        <a
          href="/"
          className="back-link"
          onClick={(event) => {
            event.preventDefault();
            setShowForm(false);
            setTitle("");
            setDescription("");
            setError("");
          }}
        >
          ← Back to Todos
        </a>

        <section className="create-form">
          <p className="eyebrow">NEW TASK</p>
          <h1>Create New Todo</h1>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <form className="edit-form" onSubmit={handleSubmit}>
            <label htmlFor="new-title">Title</label>

            <input
              id="new-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />

            <label htmlFor="new-description">Description</label>

            <textarea
              id="new-description"
              placeholder="Add more details (optional)"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <div className="edit-form-actions">
              <button
                type="submit"
                className="new-todo-button"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Todo"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setTitle("");
                  setDescription("");
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  // EDIT SCREEN
  if (editingTodo) {
    return (
      <main className="page edit-page">
        <a
          href="/"
          className="back-link"
          onClick={(event) => {
            event.preventDefault();
            handleCancelEdit();
          }}
        >
          ← Back to Todos
        </a>

        <section className="create-form">
          <p className="eyebrow">TASK DETAILS</p>
          <h1>Edit Todo</h1>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <form className="edit-form" onSubmit={handleUpdate}>
            <label htmlFor="edit-title">Title</label>

            <input
              id="edit-title"
              type="text"
              placeholder="Todo title"
              value={editingTodo.title}
              onChange={(event) =>
                setEditingTodo({
                  ...editingTodo,
                  title: event.target.value,
                })
              }
              maxLength={150}
              required
            />

            <label htmlFor="edit-description">Description</label>

            <textarea
              id="edit-description"
              placeholder="Description (optional)"
              value={editingTodo.description}
              onChange={(event) =>
                setEditingTodo({
                  ...editingTodo,
                  description: event.target.value,
                })
              }
            />

            <label htmlFor="edit-status">Status</label>

            <select
              id="edit-status"
              value={editingTodo.status}
              onChange={(event) =>
                setEditingTodo({
                  ...editingTodo,
                  status: event.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="edit-form-actions">
              <button
                type="submit"
                className="new-todo-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  // TODO LIST SCREEN
  return (
    <main className="page">
      <header className="page-header">
        <h1>Todos</h1>

        <button
          type="button"
          className="new-todo-button"
          onClick={() => {
            setTitle("");
            setDescription("");
            setError("");
            setShowForm(true);
          }}
        >
          + New todo
        </button>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <section className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search todos"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="sort-select"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort todos"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </section>

      <nav className="status-tabs" aria-label="Filter todos by status">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.value || "all"}
            className={`status-tab ${
              status === tab.value ? "active" : ""
            }`}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="message">Loading todos...</p>
      ) : sortedTodos.length === 0 ? (
        <p className="message">
          No todos found. Create your first todo!
        </p>
      ) : (
        <section className="todo-list">
          {sortedTodos.map((todo) => (
            <article
              className={`todo-card status-${todo.status}`}
              key={todo.id}
            >
              <input
                className="todo-checkbox"
                type="checkbox"
                checked={todo.status === "completed"}
                onChange={() => handleToggle(todo)}
                aria-label={`Mark ${todo.title} as completed`}
              />

              <div className="todo-content">
                <a
                  className={`todo-title ${
                    todo.status === "completed"
                      ? "completed-title"
                      : ""
                  }`}
                  href={`/details.html?id=${todo.id}`}
                >
                  {todo.title}
                </a>

                <div className="todo-meta">
                  <span
                    className={`status-badge badge-${todo.status}`}
                  >
                    {todo.status === "in_progress"
                      ? "In progress"
                      : todo.status === "completed"
                      ? "Completed"
                      : "Pending"}
                  </span>

                  {todo.status !== "completed" && (
                    <span className="todo-description">
                      {todo.description || "No description"}
                    </span>
                  )}
                </div>
              </div>

              <div className="todo-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => handleEdit(todo)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteClick(todo)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {todoToDelete && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setTodoToDelete(null);
            }
          }}
        >
          <section
            className="delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="delete-modal-heading">
              <div className="delete-icon" aria-hidden="true">
                !
              </div>

              <div>
                <h2 id="delete-modal-title">
                  Delete this todo?
                </h2>
                <p>This action cannot be undone.</p>
              </div>
            </div>

            <p
              className="delete-message"
              id="delete-modal-description"
            >
              Are you sure you want to delete{" "}
              <strong>{todoToDelete.title}</strong>?
            </p>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-delete-btn"
                onClick={() => {
                  setTodoToDelete(null);
                  setError("");
                }}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deleting}
                autoFocus
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
