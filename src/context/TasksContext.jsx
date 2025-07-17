import { createContext, useContext, useState, useEffect } from 'react';

const TasksContext = createContext();

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('timefocus-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('timefocus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = (title, estimatedPomodoros = 1) => {
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask.id;
  };

  // Update task
  const updateTask = (taskId, updates) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (currentTaskId === taskId) {
      setCurrentTaskId(null);
    }
  };

  // Toggle task completion
  const toggleTaskComplete = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Increment pomodoro count for current task
  const incrementTaskPomodoro = (taskId = currentTaskId) => {
    if (taskId) {
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
            : task
        )
      );
    }
  };

  // Get current task
  const getCurrentTask = () => {
    return tasks.find(task => task.id === currentTaskId);
  };

  // Clear completed tasks
  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    setCurrentTaskId(null);
  };

  const value = {
    tasks,
    currentTaskId,
    setCurrentTaskId,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    incrementTaskPomodoro,
    getCurrentTask,
    clearCompletedTasks,
    clearAllTasks
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};