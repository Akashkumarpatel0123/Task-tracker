import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  PieChart,
  BarChart3,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Download,
  RefreshCw,
  Clock3,
  CalendarDays,
  Sparkles
} from "lucide-react";
import { getTasks } from "../../api/tasks";

const Progress = () => {
  const [tasks, setTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);

      const today = new Date();
      // Filter tasks due today or later
      const upcoming = res.data.filter(task => {
        return task.dueDate && new Date(task.dueDate) >= today;
      });

      // Sort by due date ascending
      upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setUpcomingTasks(upcoming);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit" 
    });
  };

  // Calculate progress summary
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const onHold = tasks.filter(t => t.status === "On Hold").length;
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completed"
  ).length;
  
  const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pendingPercent = total === 0 ? 0 : Math.round((pending / total) * 100);

  // Calculate productivity metrics
  const productivityScore = total === 0 ? 0 : Math.round((completed / (total - onHold)) * 100);
  const avgCompletionTime = "2.5 days"; // This would be calculated from actual data
  const streakDays = 7; // This would be calculated from actual data

  // Priority distribution
  const highPriority = tasks.filter(t => t.priority === "High").length;
  const mediumPriority = tasks.filter(t => t.priority === "Medium").length;
  const lowPriority = tasks.filter(t => t.priority === "Low").length;

  // Time filters
  const timeFilters = [
    { id: "day", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
    { id: "all", label: "All Time" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
          <p className="text-gray-600">Track your productivity and task completion</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={loadTasks}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {timeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setTimeFilter(filter.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              timeFilter === filter.id
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl shadow-lg border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center text-emerald-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{completed}</h2>
          <p className="text-gray-600">Completed Tasks</p>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50 p-6 rounded-2xl shadow-lg border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock3 className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center text-amber-600">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">-5%</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{pending}</h2>
          <p className="text-gray-600">Pending Tasks</p>
        </div>

        <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-2xl shadow-lg border border-red-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-sm font-medium text-red-600">Attention</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{overdue}</h2>
          <p className="text-gray-600">Overdue Tasks</p>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-blue-600">Good</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{productivityScore}%</h2>
          <p className="text-gray-600">Productivity Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Task Completion Progress</h2>
              <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            <div className="space-y-8">
              {/* Overall Progress */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">Overall Completion</h3>
                  <span className="text-2xl font-bold text-gray-900">{completedPercent}%</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"
                    style={{ width: `${completedPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{completed} completed</span>
                  <span>{pending + onHold} remaining</span>
                </div>
              </div>

              {/* Priority Distribution */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Priority Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-red-600 font-medium">High Priority</span>
                      <span className="text-sm font-medium">{highPriority} tasks</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        style={{ width: `${(highPriority / total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-amber-600 font-medium">Medium Priority</span>
                      <span className="text-sm font-medium">{mediumPriority} tasks</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                        style={{ width: `${(mediumPriority / total) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-emerald-600 font-medium">Low Priority</span>
                      <span className="text-sm font-medium">{lowPriority} tasks</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: `${(lowPriority / total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div>
                <h3 className="font-medium text-gray-700 mb-4">Status Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">{completed}</div>
                    <div className="text-sm text-emerald-700 font-medium">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{pending}</div>
                    <div className="text-sm text-blue-700 font-medium">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">{onHold}</div>
                    <div className="text-sm text-purple-700 font-medium">On Hold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming tasks</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.slice(0, 5).map((task, index) => (
                  <div 
                    key={task._id || index} 
                    className="p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === "High" 
                          ? "bg-red-100 text-red-800" 
                          : task.priority === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {upcomingTasks.length > 5 && (
              <button className="w-full mt-6 py-3 text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors">
                View All Tasks ({upcomingTasks.length})
              </button>
            )}
          </div>

          {/* Productivity Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Productivity Insights</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-gray-900">{completedPercent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                    style={{ width: `${completedPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Avg. Completion Time</span>
                  <span className="font-bold text-gray-900">{avgCompletionTime}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="font-bold text-gray-900">{streakDays} days</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                    style={{ width: `${Math.min(streakDays, 30) * 3.33}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Weekly Goal</p>
                    <p className="text-2xl font-bold text-gray-900">85%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Current</p>
                    <p className="text-2xl font-bold text-emerald-600">{completedPercent}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;