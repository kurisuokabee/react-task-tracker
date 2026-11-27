import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = (event) => {
    event.preventDefault();

    const title = taskInput.trim();

    if (!title) return;

    setTasks((previousTasks) => [
      ...previousTasks,
      {
        id: Date.now(),
        title,
        completed: false,
      },
    ]);

    setTaskInput("");
  };

  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  const activeCount = tasks.length - completedCount;

  return (
    <main className="container">
      <h1>Task Tracker</h1>
      <p className="subtitle">Organize your daily tasks.</p>

      <section className="stats">
        <div>
          <strong>{tasks.length}</strong>
          <span>Total</span>
        </div>
        <div>
          <strong>{activeCount}</strong>
          <span>Active</span>
        </div>
        <div>
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>
      </section>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          aria-label="Task name"
          placeholder="Enter a task..."
          value={taskInput}
          onChange={(event) => setTaskInput(event.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      <nav className="filters" aria-label="Task filters">
        {["all", "active", "completed"].map((option) => (
          <button
            key={option}
            type="button"
            className={filter === option ? "selected" : ""}
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </nav>

      <section className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-message">No tasks to display.</p>
        ) : (
          filteredTasks.map((task) => (
            <div className="task-item" key={task.id}>
              <label>
                <input
                  type="checkbox"
                  aria-label={`Complete ${task.title}`}
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />

                <span className={task.completed ? "completed" : ""}>
                  {task.title}
                </span>
              </label>

              <button
                type="button"
                className="delete-button"
                aria-label={`Delete ${task.title}`}
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
