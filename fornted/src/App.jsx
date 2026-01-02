import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Home as HomeIcon, PieChart, User, Settings, Bell, Search } from "lucide-react";
import Home from "./Component/pages/Home";
import Progress from "./Component/pages/Progress";
import Profile from "./Component/pages/Profile";
import { getTasks } from "../src/api/tasks";

function App() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileName, setProfileName] = useState("John Doe");
  const [profileCompany, setProfileCompany] = useState("Product Manager");
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load profile from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem("profilePhoto");
    const savedName = localStorage.getItem("profileName");
    const savedCompany = localStorage.getItem("profileCompany");

    if (savedPhoto) setProfilePhoto(savedPhoto);
    if (savedName) setProfileName(savedName);
    if (savedCompany) setProfileCompany(savedCompany);
  }, []);

  // Load tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    loadTasks();
  }, []);

  // Count notifications (e.g., pending or overdue tasks)
  const today = new Date().toISOString().split("T")[0];
  const notificationCount = tasks.filter(
    (t) => t.status !== "Completed" && t.dueDate && t.dueDate <= today
  ).length;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex bg-gray-50">

        {/* SIDEBAR */}
        <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col fixed h-screen">

          {/* Logo/Brand Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TaskTracker</h1>
                <p className="text-xs text-gray-400">Productivity Suite</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-indigo-500 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-indigo-500 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <PieChart className="w-5 h-5" />
              <span className="font-medium">Progress</span>
              {/* Dynamic task count */}
              <span className="ml-auto bg-indigo-500 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-indigo-500 text-white shadow-md" : "hover:bg-gray-700 text-gray-300"
                }`
              }
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </NavLink>

            <div className="mt-auto pt-4 border-t border-gray-700">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-300"
                  }`
                }
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </NavLink>
            </div>
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{profileName}</p>
                <p className="text-xs text-gray-400">{profileCompany}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="px-8 py-4 flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    placeholder="Search tasks, projects, or teams..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="mb-6">
              <nav className="text-sm text-gray-600">
                <ol className="flex items-center space-x-2">
                  <li>Home</li>
                  <li className="text-gray-400">/</li>
                  <li className="text-indigo-600 font-medium">Dashboard</li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Dashboard</h1>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-200">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home searchTerm={searchTerm} />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<div className="p-8">Settings Page</div>} />
              </Routes>
            </div>

            <footer className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>© 2024 TaskTracker. All rights reserved.</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                  <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                  <a href="#" className="hover:text-indigo-600">Support</a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
