import { useState, useEffect } from "react";
import CreateTask from "../components/CreateTask";
import ListTask from "../components/ListTask";

const Homepage = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        const response = await fetch("https://kanban-board-f6gc.onrender.com/todo/task", {
          method: "GET",
          headers: {
            "Authorization": `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    fetchTasks();
  }, [tasks]);

  return (
    <div className="bg-slate-100 w-screen h-screen flex flex-col items-center p-3 gap-16 pt-32">
      <h1 className="text-6xl font-bold text-gray-500 mb-8">Kanban Board</h1>
      <CreateTask tasks={tasks} setTasks={setTasks} />
      <ListTask tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default Homepage;
