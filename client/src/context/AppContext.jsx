import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    setIsInitialized(true); 
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchBlogs();
    }
  }, [isInitialized]);

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
    }),
    [navigate, blogs, input, isInitialized]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
