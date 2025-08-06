import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/blog"); 
      if (res.data.success) {
        setBlogs(res.data.blogs);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await axios.get("/api/v1/admin/dashboard"); 
      if (res.data.success) {
        setAdmin(res.data.admin); 
        setToken(res.data.token || true); 
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAdmin(null);
      setToken(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post("/api/v1/admin/logout"); 
      setAdmin(null);
      setToken(null);
      navigate("/admin");
      toast.success("Logged out successfully");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setAdmin(null);
      setToken(null);
      navigate("/admin");
      toast.error("Logout failed");
    }
  }, [navigate]);

  useEffect(() => {
    setIsInitialized(true);
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isInitialized) {
      fetchBlogs();
    }
  }, [isInitialized, fetchBlogs]);

  const value = useMemo(
    () => ({
      axios,
      navigate,
      blogs,
      setBlogs,
      input,
      setInput,
      fetchBlogs,
      isInitialized,
      admin,
      setAdmin,
      token,
      setToken,
      logout,
      isAuthLoading,
    }),
    [navigate, blogs, input, isInitialized, admin, token, fetchBlogs, logout, isAuthLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
