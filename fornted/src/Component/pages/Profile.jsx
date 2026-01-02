import React, { useState, useEffect } from "react";
import {
  User,
  Camera,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit2,
  Check,
  X,
  Upload,
  Shield,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  Award,
  Calendar,
  Users
} from "lucide-react";

const Profile = () => {
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem("profilePhoto");
    const savedName = localStorage.getItem("profileName");
    const savedCompany = localStorage.getItem("profileCompany");
    const savedEmail = localStorage.getItem("profileEmail") || "user@example.com";
    const savedPhone = localStorage.getItem("profilePhone") || "+1 (555) 123-4567";
    const savedLocation = localStorage.getItem("profileLocation") || "San Francisco, CA";
    const savedWebsite = localStorage.getItem("profileWebsite") || "example.com";
    const savedBio = localStorage.getItem("profileBio") || "Product designer with 8+ years of experience. Passionate about creating beautiful and functional interfaces.";

    if (savedPhoto) setPhoto(savedPhoto);
    if (savedName) setName(savedName);
    if (savedCompany) setCompany(savedCompany);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setLocation(savedLocation);
    setWebsite(savedWebsite);
    setBio(savedBio);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoURL = reader.result;
        setPhoto(photoURL);
        localStorage.setItem("profilePhoto", photoURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!name || !company) {
      setSuccessMessage("Please fill in all required fields!");
      return;
    }

    // Save all profile data to localStorage
    localStorage.setItem("profileName", name);
    localStorage.setItem("profileCompany", company);
    localStorage.setItem("profileEmail", email);
    localStorage.setItem("profilePhone", phone);
    localStorage.setItem("profileLocation", location);
    localStorage.setItem("profileWebsite", website);
    localStorage.setItem("profileBio", bio);

    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleReset = () => {
    setIsEditing(false);
    // Reload saved data
    const savedName = localStorage.getItem("profileName") || "";
    const savedCompany = localStorage.getItem("profileCompany") || "";
    const savedEmail = localStorage.getItem("profileEmail") || "user@example.com";
    const savedPhone = localStorage.getItem("profilePhone") || "+1 (555) 123-4567";
    const savedLocation = localStorage.getItem("profileLocation") || "San Francisco, CA";
    const savedWebsite = localStorage.getItem("profileWebsite") || "example.com";
    const savedBio = localStorage.getItem("profileBio") || "Product designer with 8+ years of experience. Passionate about creating beautiful and functional interfaces.";

    setName(savedName);
    setCompany(savedCompany);
    setEmail(savedEmail);
    setPhone(savedPhone);
    setLocation(savedLocation);
    setWebsite(savedWebsite);
    setBio(savedBio);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const stats = [
    { label: "Projects", value: "24", icon: <Award className="w-4 h-4" /> },
    { label: "Team Members", value: "12", icon: <Users className="w-4 h-4" /> },
    { label: "Active Tasks", value: "8", icon: <Calendar className="w-4 h-4" /> },
    { label: "Completed", value: "142", icon: <Check className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Profile Header */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <label className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{name || "John Doe"}</h2>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Building className="w-4 h-4" />
                  {company || "Acme Inc."}
                </p>
                <p className="text-sm text-gray-500 mt-2">{bio.substring(0, 80)}...</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <div className="mt-8 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-8 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600">Update your personal details here</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSave} className="p-6">
                  {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{successMessage}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          disabled={!isEditing}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isEditing
                              ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              : "border-gray-200 bg-gray-50"
                            }`}
                          placeholder="Enter website URL"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border ${isEditing
                          ? "border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          : "border-gray-200 bg-gray-50"
                        }`}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 mt-8">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {activeTab !== "profile" && (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  {React.cloneElement(tabs.find(t => t.id === activeTab)?.icon, { className: "w-8 h-8 text-indigo-600" })}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </h3>
                <p className="text-gray-500">
                  {activeTab === "security" && "Manage your password and security settings"}
                  {activeTab === "notifications" && "Configure your notification preferences"}
                  {activeTab === "billing" && "View and manage your billing information"}
                  {activeTab === "settings" && "Adjust your account settings"}
                </p>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last login</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used: 2.4 GB</span>
                  <span className="text-gray-600">Total: 10 GB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "24%" }}></div>
                </div>
                <p className="text-sm text-gray-500">Upload new files to increase storage</p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upgrade Storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;