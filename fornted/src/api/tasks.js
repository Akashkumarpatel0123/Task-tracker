import axios from "axios";

const API = "http://localhost:5000";

export const createTask = (taskData) =>
  axios.post(`${API}/tasks`, taskData);

export const getTasks = () =>
  axios.get(`${API}/tasks`);

export const updateTask = (id, data) =>
  axios.put(`${API}/tasks/${id}`, data);

export const deleteTask = (id) =>
  axios.delete(`${API}/tasks/${id}`);
