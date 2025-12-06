import api from "./api";

export const loginService = (credentials) =>
  api.post("/sessions/login", credentials);

export const registerService = (data) => api.post("/sessions/register", data);

export const checkOnline = () => api.get("/sessions/online");

export const logoutService = () => api.post("/sessions/signout");
