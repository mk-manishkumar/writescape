import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function LikeButton({ initialLikes, initiallyLiked, blogId, isAuthenticated, axios, className = "" }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Only registered users can like blogs. Please log in.");
      return;
    }

    if (isLiked) {
      toast("You have already liked this blog.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/v1/blog/like", { blogId });
      if (response.data.success) {
        setLikes(response.data.likesCount);
        setIsLiked(true);
        toast.success("Blog liked!");
      } else {
        toast.error(response.data.message || "Failed to like the blog");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLike} disabled={loading} className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm ${className}`} aria-label="Like blog post" style={{ cursor: loading ? "not-allowed" : "pointer" }}>
      <span className="text-gray-700 font-medium">{likes}</span>
      <Heart className={`w-5 h-5 transition-colors duration-200 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}`} />
    </button>
  );
}
