const ListTask = ({ tasks, setTasks }) => {
    const handleDelete = async (id) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }
  
        const response = await fetch(`https://kanban-board-f6gc.onrender.com/todo/task/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `${token}`,
          },
        });
  
        if (response.ok) {
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        } else {
          console.error('Failed to delete task');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };
  
    return (
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Task List</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="p-4 mb-4 bg-gray-100 rounded-md shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-gray-600">{task.status}</p>
                  <p className="text-gray-600">{task.tag}</p>
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No tasks available.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ListTask;
  //