import { Plus, MoreVertical, Check, Trash2, X, Target, Clock, Trophy, Edit3, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TasksSection() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskHours, setNewTaskHours] = useState(1);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editHours, setEditHours] = useState(1);
  const [editNote, setEditNote] = useState('');
  const [taskMenuId, setTaskMenuId] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('timefocus-tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

      const savedActiveTask = localStorage.getItem('timefocus-active-task');
      if (savedActiveTask) {
        setActiveTaskId(JSON.parse(savedActiveTask));
      }
    } catch (error) {
      setTasks([]);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('timefocus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save active task to localStorage
  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('timefocus-active-task', JSON.stringify(activeTaskId));
    } else {
      localStorage.removeItem('timefocus-active-task');
    }
  }, [activeTaskId]);

  const addTask = () => {
    if (newTaskTitle.trim() && newTaskHours > 0) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        targetHours: newTaskHours,
        hoursWorked: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        icon: getRandomTaskIcon(),
        note: ''
      };
      
      setTasks(prev => [...prev, newTask]);
      setNewTaskTitle('');
      setNewTaskHours(1);
      setShowAddTask(false);
      showToast(`📝 مهمة جديدة أضيفت! 🎯`);
    }
  };

  const getRandomTaskIcon = () => {
    const icons = ['📚', '💻', '📝', '🎯', '⚡', '🚀', '💡', '🔥', '⭐', '🎨', '📊', '🏆'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    setTaskMenuId(null);
    setEditingTask(null);
    showToast(`🗑️ مهمة محذوفة!`);
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        if (!task.completed && updatedTask.completed) {
          updatedTask.hoursWorked = task.targetHours;
          showToast(`✅ مهمة مكتملة! 🏆`);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const setActiveTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
      showToast('⏸️ توقف العمل');
    } else {
      setActiveTaskId(taskId);
      showToast(`🎯 العمل على: "${task?.title}" 🚀`);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, lastWorkedAt: new Date().toISOString() }
          : t
      ));
    }
  };

  const addWorkTime = (taskId, hours) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newHoursWorked = Math.min(task.hoursWorked + hours, task.targetHours);
        const isCompleted = newHoursWorked >= task.targetHours;
        
        const updatedTask = {
          ...task,
          hoursWorked: newHoursWorked,
          completed: isCompleted,
          lastWorkedAt: new Date().toISOString()
        };

        if (isCompleted && !task.completed) {
          showToast(`🎉 مهمة مكتملة تلقائياً! 🏆`);
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const startEditTask = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditHours(task.targetHours);
    setEditNote(task.note || '');
    setTaskMenuId(null);
  };

  const saveEditTask = () => {
    if (editTitle.trim()) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask 
          ? { ...task, title: editTitle.trim(), targetHours: editHours, note: editNote }
          : task
      ));
      setEditingTask(null);
      showToast(`✏️ مهمة محدثة!`);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditHours(1);
    setEditNote('');
  };

  const clearCompletedTasks = () => {
    const completed = tasks.filter(task => task.completed).length;
    setTasks(prev => prev.filter(task => !task.completed));
    setShowTaskMenu(false);
    showToast(`🧹 ${completed} مهمة محذوفة!`);
  };

  const clearAllTasks = () => {
    setTasks([]);
    setActiveTaskId(null);
    setShowTaskMenu(false);
    showToast(`🗑️ جميع المهام محذوفة!`);
  };

  const getProgressPercentage = (task) => {
    return Math.min((task.hoursWorked / task.targetHours) * 100, 100);
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: system-ui;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
    `;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      if (style.parentNode) style.parentNode.removeChild(style);
    }, 3000);
  };

  const activeTask = tasks.find(task => task.id === activeTaskId);
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalWorkedHours = tasks.reduce((sum, task) => sum + task.hoursWorked, 0);

  return (
    <div className="sticky top-1 z-30 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg mx-3 my-2">
      {/* Header */}
      <div className="p-2.5 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md flex items-center justify-center">
              <Target size={10} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Tasks</h2>
              {tasks.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-full text-xs">
                    {tasks.filter(task => !task.completed).length}/{tasks.length}
                  </span>
                  <span className="text-white/60 text-xs">• {totalWorkedHours.toFixed(1)}h</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setShowAddTask(!showAddTask)}
              className="p-1.5 hover:bg-white/20 rounded-md transition-all text-white transform hover:scale-105"
            >
              <Plus size={12} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowTaskMenu(!showTaskMenu)}
                className="p-1.5 hover:bg-white/20 rounded-md transition-all text-white"
              >
                <MoreVertical size={12} />
              </button>
              
              {showTaskMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowTaskMenu(false)} />
                  <div className="absolute right-0 top-7 bg-white/95 backdrop-blur rounded-lg shadow-xl border p-1 z-20 min-w-32">
                    <button 
                      onClick={clearCompletedTasks}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded text-xs text-gray-700"
                      disabled={completedTasks === 0}
                    >
                      🧹 Clear Done ({completedTasks})
                    </button>
                    <button 
                      onClick={clearAllTasks}
                      className="w-full text-left px-2 py-1.5 hover:bg-red-50 rounded text-xs text-red-600"
                      disabled={tasks.length === 0}
                    >
                      🗑️ Clear All ({tasks.length})
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Active Task Indicator */}
        {activeTask && (
          <div className="mt-2 p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-md border border-green-400/30">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-100 text-xs">Active:</span>
              <span className="text-white font-bold text-xs">{activeTask.icon} {activeTask.title}</span>
              <span className="text-green-200 text-xs">({activeTask.hoursWorked.toFixed(1)}/{activeTask.targetHours}h)</span>
            </div>
          </div>
        )}
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="p-2.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-white/10">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTask();
              if (e.key === 'Escape') setShowAddTask(false);
            }}
            placeholder="✨ What do you want to accomplish?"
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400/50 text-sm mb-2"
            autoFocus
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-xs">🎯</span>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={newTaskHours}
                onChange={(e) => setNewTaskHours(parseFloat(e.target.value) || 1)}
                className="w-14 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs text-center focus:outline-none"
              />
              <span className="text-white/60 text-xs">hours</span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={addTask}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-1 px-3 rounded text-xs font-semibold hover:scale-105 transition-transform"
              >
                Add
              </button>
              <button 
                onClick={() => setShowAddTask(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="max-h-40 overflow-y-auto">
        <div className="p-1.5 space-y-1">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-white/60">
              <div className="text-xl mb-1">🎯</div>
              <p className="text-xs">No tasks yet</p>
              <p className="text-xs opacity-70">Add your first task! ✨</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id}>
                {/* Task Item */}
                {editingTask !== task.id ? (
                  <div 
                    className={`rounded-md p-2 transition-all hover:bg-white/15 relative ${
                      task.id === activeTaskId 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/40' 
                        : task.completed 
                          ? 'bg-white/5 opacity-80' 
                          : 'bg-white/10'
                    }`}
                  >
                    {/* Strikethrough line for completed tasks */}
                    {task.completed && (
                      <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-gray-400 rounded-full transform -translate-y-1/2 z-10"></div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        {/* Checkbox */}
                        <button 
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`w-4 h-4 rounded-full border flex items-center justify-center z-20 relative ${
                            task.completed 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-white/50 hover:border-white'
                          }`}
                        >
                          {task.completed && <Check size={8} className="text-white" />}
                        </button>
                        
                        {/* Task Content */}
                        <div className="flex items-center space-x-1.5 flex-1">
                          <span className="text-sm">{task.icon}</span>
                          <span className={`text-white text-xs font-medium truncate ${
                            task.completed ? 'opacity-75' : ''
                          }`}>
                            {task.title}
                          </span>
                          
                          {/* Active Indicator */}
                          {task.id === activeTaskId && !task.completed && (
                            <div className="flex items-center space-x-1 bg-green-500/20 px-1.5 py-0.5 rounded-full">
                              <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-green-300 text-xs font-bold">Active</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Progress */}
                        <div className="text-white/70 text-xs font-mono">
                          {task.hoursWorked.toFixed(1)}/{task.targetHours}h
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1">
                        {/* Task Menu */}
                        <div className="relative">
                          <button 
                            onClick={() => setTaskMenuId(taskMenuId === task.id ? null : task.id)}
                            className="text-white/50 hover:text-white p-1 rounded transition-all"
                          >
                            <MoreVertical size={10} />
                          </button>
                          
                          {taskMenuId === task.id && (
                            <>
                              <div className="fixed inset-0 z-30" onClick={() => setTaskMenuId(null)} />
                              <div className="absolute right-0 top-6 bg-white/95 backdrop-blur rounded-lg shadow-xl border p-1 z-40 min-w-24">
                                <button 
                                  onClick={() => startEditTask(task)}
                                  className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded text-xs text-gray-700 flex items-center space-x-1"
                                >
                                  <Edit3 size={10} />
                                  <span>Edit</span>
                                </button>
                                <button 
                                  onClick={() => deleteTask(task.id)}
                                  className="w-full text-left px-2 py-1.5 hover:bg-red-50 rounded text-xs text-red-600 flex items-center space-x-1"
                                >
                                  <Trash2 size={10} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-1.5 w-full bg-white/20 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          task.completed 
                            ? 'bg-gradient-to-r from-green-400 to-green-600' 
                            : task.id === activeTaskId
                              ? 'bg-gradient-to-r from-green-400 to-green-600 animate-pulse'
                              : 'bg-gradient-to-r from-blue-400 to-indigo-600'
                        }`}
                        style={{ width: `${getProgressPercentage(task)}%` }}
                      />
                    </div>

                    {/* Note Preview */}
                    {task.note && (
                      <div className="mt-1 text-white/60 text-xs italic truncate">
                        📝 {task.note}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Edit Task Form */
                  <div className="bg-white/90 rounded-lg p-3 border border-white/30">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-800 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Task title..."
                    />
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-600 text-xs">Act / Est Pomodoros</span>
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={Math.floor(task.hoursWorked)}
                          disabled
                          className="w-12 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-600 text-xs text-center"
                        />
                        <span className="text-gray-400">/</span>
                        <input
                          type="number"
                          value={editHours}
                          onChange={(e) => setEditHours(parseFloat(e.target.value) || 1)}
                          className="w-12 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-gray-800 text-xs text-center focus:outline-none"
                        />
                        <div className="flex flex-col">
                          <button
                            onClick={() => setEditHours(prev => prev + 0.5)}
                            className="p-0.5 hover:bg-gray-200 rounded"
                          >
                            <ChevronUp size={10} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => setEditHours(prev => Math.max(0.5, prev - 0.5))}
                            className="p-0.5 hover:bg-gray-200 rounded"
                          >
                            <ChevronDown size={10} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Add Note..."
                      className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-800 text-xs mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      rows="2"
                    />

                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-xs font-medium transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditTask}
                          className="px-3 py-1 bg-gray-800 text-white rounded text-xs font-medium hover:bg-gray-900 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      {tasks.length > 0 && (
        <div className="p-2.5 border-t border-white/10 bg-white/5">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <Trophy size={12} className="text-yellow-400" />
              <span className="text-white font-medium">{completedTasks}/{tasks.length} Done</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={12} className="text-blue-400" />
              <span className="text-white font-medium">{totalWorkedHours.toFixed(1)} Worked</span>
            </div>
          </div>
          
          <div className="mt-1.5 w-full bg-white/20 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}