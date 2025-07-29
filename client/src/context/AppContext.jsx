import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Track initialization

  // Setup Axios headers whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const fetchBlogs = async () => {
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
  };

  // ✅ Initialize token first, then fetch blogs
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        // Set axios headers immediately
        axios.defaults.headers.common["Authorization"] = storedToken;
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // ✅ Fetch blogs only after initialization
  useEffect(() => {
    if (isInitialized) {
      fetchBlogs();
    }
  }, [isInitialized]);

  const value = useMemo(
    () => ({
      axios,
      navigate,
      token,
      setToken,
      blogs,
      setBlogs,
      input,
      setInput,
      fetchBlogs,
      isInitialized, // ✅ Expose initialization state
    }),
    [navigate, token, blogs, input, isInitialized]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
