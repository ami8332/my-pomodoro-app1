import { Plus, MoreVertical, Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useTimer } from '@/context/TimerContext';

export default function TasksSection() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  
  const { completeTask } = useTimer();

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        estimatedPomodoros: newTaskPomodoros,
        completedPomodoros: 0,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskPomodoros(1);
      setShowAddTask(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        
        // If task is being marked as completed, update user stats
        if (!task.completed && updatedTask.completed) {
          completeTask();
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
    setShowTaskMenu(false);
  };

  const clearAllTasks = () => {
    setTasks([]);
    setShowTaskMenu(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Today's Tasks</h2>
        <div className="relative">
          <button 
            onClick={() => setShowTaskMenu(!showTaskMenu)}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            <MoreVertical className="text-white" size={20} />
          </button>
          
          {/* Tasks Menu */}
          {showTaskMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg py-2 min-w-48 z-10">
              <button 
                onClick={clearCompletedTasks}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700"
              >
                Clear finished tasks
              </button>
              <button 
                onClick={clearAllTasks}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
              >
                Clear all tasks
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Task List */}
      {tasks.length > 0 && (
        <div className="space-y-3 mb-6">
          {tasks.map(task => (
            <div key={task.id} className={`bg-white/5 rounded-xl p-4 border border-white/10 ${task.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-white font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-white/70 text-sm">
                        {task.completedPomodoros}/{task.estimatedPomodoros} pomodoros
                      </span>
                      {task.completed && (
                        <span className="text-green-400 text-sm font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <Trash2 size={16} className="text-white/70" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Section */}
      {showAddTask ? (
        <div className="bg-white/5 rounded-xl p-4 border border-white/20">
          <div className="space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What are you working on?"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <label className="text-white/80 text-sm">Est. pomodoros:</label>
                <select
                  value={newTaskPomodoros}
                  onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num} className="bg-gray-800">{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <X size={18} className="text-white/70" />
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex items-center space-x-2 text-white font-medium"
                >
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="w-full bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/30 rounded-xl p-6 transition-all duration-300 flex items-center justify-center space-x-2 text-white/80 hover:text-white"
        >
          <Plus size={20} />
          <span className="font-medium">Add Task</span>
        </button>
      )}

      {/* Task Summary */}
      {tasks.length > 0 && (
        <div className="mt-6 text-center">
          <div className="text-white/80 text-sm">
            {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
          </div>
          {tasks.filter(t => t.completed).length === tasks.length && tasks.length > 0 && (
            <div className="text-green-400 text-sm font-medium mt-1">
              🎉 All tasks completed! Great job!
            </div>
          )}
        </div>
      )}
    </div>
  );
}