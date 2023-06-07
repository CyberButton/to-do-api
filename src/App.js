import { useState, useEffect } from 'react';
import { TodoistApi } from "@doist/todoist-api-typescript"
import 'tailwindcss/tailwind.css';
import './styles.css';

const api = new TodoistApi("bb57a7eb53e2d76bb74eebdf165eb66a9764e352");

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.getTasks();
      const tasks = response.map(
        (task) => ({
          id: task.id,
          name: task.content,
          completed: task.isCompleted
        })
      );
      setTodos(tasks);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect( () => {
    // you can call async/await here so using seperate function
    fetchData();
  }, []);

  /* dont need this */
  // useEffect(() => {
  //   localStorage.setItem('todos', JSON.stringify(todos));
  // }, [todos]);

  const addTodo = async () => {
    if (newTodo.trim() !== '') {

      try {
        const response = await api.addTask(
          {
            content: newTodo
          }
        )
        const newTask = {id: response.id, name: newTodo, completed: false};
        setTodos([...todos, newTask]);
      } catch (error) {
        console.error(error);
      }
      setNewTodo('');
    }
  };

  const deleteTodo = async (index, id) => {
    try {
      const response = await api.deleteTask(id);
      if(response) {
        const updatedTodos = [...todos];
        updatedTodos.splice(index, 1);
        setTodos(updatedTodos);
      } else {
        alert("failed to delete");
      }
    } catch (error) {
      console.error(error);
    }

  };

  const toggleComplete = async (index, id) => {
    try {
      const response = await api.getTask(id);

      const responseChange = response.isCompleted 
      ? await api.reopenTask(id)
      : await api.closeTask(id)
      
      if(responseChange) {
        const updatedTodos = [...todos];
        updatedTodos[index].completed = !updatedTodos[index].completed;
        setTodos(updatedTodos);
      } else {
        alert("failed to check/uncheck");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow rounded-l-md border border-gray-300 p-2 focus:outline-none"
          placeholder="Enter a new task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-md px-4 py-2"
          onClick={addTodo}
        >
          ---Add---
        </button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="flex items-center justify-between border-b border-gray-300 py-2"
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={todo.completed}
                onChange={() => toggleComplete(index, todo.id)}
              />
              {todo.name}
            </label>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => deleteTodo(index, todo.id)}
            >
              ---Delete---
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;
