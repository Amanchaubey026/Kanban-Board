/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDrag, useDrop } from 'react-dnd';

const ListTask = ({ tasks, setTasks }) => {
    const [pending, setPending] = useState([]);
    const [inprog, setInprog] = useState([]);
    const [completed, setCompleted] = useState([]);

    useEffect(() => {
        const fPending = tasks.filter((task) => task.status === "pending");
        const fInProg = tasks.filter((task) => task.status === "in-progress");
        const fCompleted = tasks.filter((task) => task.status === "completed");

        setPending(fPending);
        setInprog(fInProg);
        setCompleted(fCompleted);
    }, [tasks]);

    const statuses = ["pending", "in-progress", "completed"];

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const response = await fetch(`https://kanban-board-f6gc.onrender.com/todo/task/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update the tasks state after successful update on the backend
                const updatedTasks = tasks.map(task => {
                    if (task._id === taskId) {
                        return { ...task, status: newStatus };
                    }
                    return task;
                });
                setTasks(updatedTasks);
            } else {
                console.error("Failed to update task status");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="flex gap-16 ">
            {statuses.map((status, index) => (
                <Section
                    key={index}
                    status={status}
                    tasks={tasks}
                    setTasks={setTasks}
                    updateTaskStatus={updateTaskStatus}
                    pending={pending}
                    inprog={inprog}
                    completed={completed}
                />
            ))}
        </div>
    );
};

const Section = ({ status, tasks, setTasks, updateTaskStatus, pending, inprog, completed }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item) => updateTaskStatus(item.id, status), // Call the updateTaskStatus function with the dropped task ID and the new status
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    useEffect(() => {
        console.log(isOver);
    }, [isOver]);

    let text = "pending List";
    let bg = "bg-slate-500";
    let taskToMap = pending;

    if (status === "in-progress") {
        text = "In Progress";
        bg = "bg-purple-500";
        taskToMap = inprog;
    }
    if (status === "completed") {
        text = "Completed";
        bg = "bg-green-500";
        taskToMap = completed;
    }

    return (
        <div ref={drop} className={`w-64 p-2 ${isOver ? "bg-slate-200" : ""}`}>
            <Header text={text} bg={bg} count={taskToMap.length} />
            {taskToMap.length > 0 &&
                taskToMap.map((task) => (
                    <Task key={task._id} task={task} tasks={tasks} setTasks={setTasks} />
                ))}
        </div>
    );
};

const Header = ({ text, bg, count }) => {
    return (
        <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}>
            {text}{" "}
            <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex items-center justify-center">
                {count}
            </div>
        </div>
    );
};

const Task = ({ task, tasks, setTasks }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id: task._id, type: "task" },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    useEffect(() => {
        console.log(isDragging);
    }, [isDragging]);

    const handleRemove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const response = await fetch(`https://kanban-board-f6gc.onrender.com/todo/task/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token,
                },
            });

            if (response.ok) {
                const updatedTasks = tasks.filter(t => t._id !== id);
                setTasks(updatedTasks);
            } else {
                console.error("Failed to delete task");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div ref={drag} className={`relative p-4 mt-8 shadow-md rounded-md cursor-grab ${isDragging ? "opacity-25" : "opacity-100"}`}>
            <p>{task.title}</p>
            <button className="absolute bottom-3 right-1 text-slate-400" onClick={() => handleRemove(task._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
    );
};

export default ListTask;
