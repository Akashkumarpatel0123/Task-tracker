import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronRight,
  CheckCircle,
  PauseCircle,
  AlertCircle,
  Target,
  Plus,
  X,
  Clock,
  TrendingUp,
  MoreVertical,
  Edit2,
  Trash2,
  Filter,
  Search
} from "lucide-react";

import { createTask, getTasks, deleteTask } from "../../api/tasks";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // ===== FORM STATES =====
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");

  // ===== TASK LIST =====
  const [tasks, setTasks] = useState([]);

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Save Task
  const handleSave = async () => {
    if (!title) return alert("Title is required");

    try {
      await createTask({
        title,
        dueDate,
        priority,
        status,
        description
      });

      // clear form
      setTitle("");
      setDueDate("");
      setPriority("Low");
      setStatus("Pending");
      setDescription("");
      setShowForm(false);

      // reload tasks
      loadTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // ======================
  // 📊 REAL DASHBOARD DATA
  // ======================
  const today = new Date().toISOString().split("T")[0];

  const todayTasks = tasks.filter(
    t => t?.dueDate?.substring(0, 10) === today
  ).length;

  const onHoldTasks = tasks.filter(t => t?.status === "On Hold").length;

  const goalTasks = tasks.filter(t => t?.priority === "High").length;

  const overdueTasks = tasks.filter(
    t => t?.dueDate && t?.dueDate < today && t?.status !== "Completed"
  ).length;

  // Filter tasks based on search and filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Priority color mapping
  const priorityColors = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600"
  };

  // Status color mapping
  const statusColors = {
    Pending: "bg-blue-100 text-blue-600",
    Completed: "bg-emerald-100 text-emerald-600",
    "On Hold": "bg-purple-100 text-purple-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your daily tasks and progress</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Filter className="w-4 h-4" />
            <span className="text-gray-700">Filter</span>
          </button>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* TASK FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Task</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title *
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-xl p-3"
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-xl p-3"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl p-3"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 h-32"
                  placeholder="Add details about this task..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-shadow"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {["All", "Pending", "Completed", "On Hold"].map((statusType) => (
            <button
              key={statusType}
              onClick={() => setFilterStatus(statusType)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filterStatus === statusType
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {statusType}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{todayTasks}</h2>
          <p className="text-gray-600">Today's Tasks</p>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <PauseCircle className="w-6 h-6 text-purple-600" />
            </div>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{onHoldTasks}</h2>
          <p className="text-gray-600">On Hold</p>
        </div>

        <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-semibold text-orange-600">High Priority</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{goalTasks}</h2>
          <p className="text-gray-600">Goals</p>
        </div>

        <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-2xl shadow-lg border border-red-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs text-red-500 font-medium">URGENT</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{overdueTasks}</h2>
          <p className="text-gray-600">Overdue</p>
        </div>
      </div>

      {/* PROGRESS SECTION */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Task Progress</h2>
          <span className="text-sm text-gray-500">{completedTasks} of {tasks.length} completed</span>
        </div>
        <div className="mb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{completionRate}% Complete</span>
          <span>{tasks.length - completedTasks} remaining</span>
        </div>
      </div>

      {/* TASKS LIST */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Today's Tasks</h2>
          <p className="text-gray-600 mt-1">Manage your daily workload</p>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or create a new task</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Create Your First Task
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task._id}
                className="p-4 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors
                          ${task.status === "Completed"
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-gray-300 hover:border-emerald-400"}`}
                      >
                        {task.status === "Completed" && (
                          <CheckCircle className="text-white w-4 h-4" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-medium text-gray-900 truncate ${
                          task.status === "Completed" ? "line-through text-gray-400" : ""
                        }`}>
                          {task.title}
                        </h4>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {task.description && (
                          <span className="truncate">{task.description}</span>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate.substring(0, 10)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;