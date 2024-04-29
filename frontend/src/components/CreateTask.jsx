/* eslint-disable react/prop-types */
import { useState } from "react";

const CreateTask = ({ tasks, setTasks }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      const response = await fetch("https://kanban-board-f6gc.onrender.com/todo/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify(task),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]); 
        setTask({
          title: "",
          description: "",
          status: "pending", 
        });
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Title"
        className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
      />
      <input
        type="text"
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 w-64 px-1"
      />
      <select
        name="status"
        value={task.status}
        onChange={handleChange}
        className="border-2 border-slate-400 bg-slate-100 rounded-md mr-4 h-12 px-1"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit" className="bg-cyan-500 rounded-md px-4 h-12 text-white">
        Add Task
      </button>
    </form>
  );
};

export default CreateTask;
