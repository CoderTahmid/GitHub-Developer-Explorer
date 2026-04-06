const AUTH_STORAGE_KEY = "gde_auth_session";

export const getMockCredentials = () => ({
  email: import.meta.env.VITE_AUTH_EMAIL || "",
  password: import.meta.env.VITE_AUTH_PASSWORD || "",
});

export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
};

export const login = () => {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
};

export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const authStorageKey = AUTH_STORAGE_KEY;
