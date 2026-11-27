import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("Task Tracker", () => {
  const getStat = (label) => {
    const stats = screen.getByText("Total").parentElement.parentElement;
    const stat = Array.from(stats.children).find(
      (item) => item.querySelector("span")?.textContent === label,
    );

    return stat.querySelector("strong");
  };
  it("adds a valid task", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Task name" }),
      "Complete project",
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    expect(screen.getByText("Complete project")).toBeInTheDocument();
    expect(getStat("Total")).toHaveTextContent("1");
    expect(getStat("Active")).toHaveTextContent("1");
  });

  it("rejects an empty task", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    expect(screen.getByText("No tasks to display.")).toBeInTheDocument();
    expect(getStat("Total")).toHaveTextContent("0");
  });

  it("marks a task as completed", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Task name" }),
      "Study React",
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await user.click(
      screen.getByRole("checkbox", { name: "Complete Study React" }),
    );

    expect(
      screen.getByRole("checkbox", { name: "Complete Study React" }),
    ).toBeChecked();

    expect(getStat("Completed")).toHaveTextContent("1");
    expect(getStat("Active")).toHaveTextContent("0");
  });

  it("filters completed tasks", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Task name" }),
      "Study React",
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await user.click(
      screen.getByRole("checkbox", { name: "Complete Study React" }),
    );

    await user.click(screen.getByRole("button", { name: "Completed" }));

    expect(screen.getByText("Study React")).toBeInTheDocument();
  });

  it("deletes a task", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Task name" }),
      "Temporary task",
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await user.click(
      screen.getByRole("button", { name: "Delete Temporary task" }),
    );

    expect(screen.queryByText("Temporary task")).not.toBeInTheDocument();
    expect(screen.getByText("No tasks to display.")).toBeInTheDocument();
  });

  it("filters active tasks", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByRole("textbox", { name: "Task name" }),
      "Pending task",
    );

    await user.click(screen.getByRole("button", { name: "Add Task" }));

    await user.click(screen.getByRole("button", { name: "Active" }));

    expect(screen.getByText("Pending task")).toBeInTheDocument();
  });
});
