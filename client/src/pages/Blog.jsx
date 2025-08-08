import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Moment from "moment";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import LikeButton from "../components/admin/LikeButton";

const Blog = () => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BASE_URL;

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const { axios, token, admin } = useAppContext();

  const isAuthenticated = Boolean(token);
  const currentAdminId = admin?._id;

  const fetchBlogData = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/blog/${id}`);
      const result = await response.json();

      if (result.success) {
        setData(result.blog);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to fetch blog data");
    }
  }, [backendUrl, id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/blog/comments/${id}`);
      const result = await response.json();

      if (result.success) {
        setComments(result.comments);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  }, [backendUrl, id]);

  const addComment = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/v1/blog/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: id,
          name: name.trim(),
          text: content.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Comment added successfully! It will appear after approval.");
        setName("");
        setContent("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [fetchBlogData, fetchComments]);

  if (!data) return <Loader />;

  // Correctly check if current admin id exists in likedBy array by string comparison
  const initiallyLiked = isAuthenticated && Array.isArray(data.likedBy) && data.likedBy.some((likedAdminId) => likedAdminId.toString() === currentAdminId);

  return (
    <div className="relative">
      <img src={assets.gradientBackground} alt="" className="absolute -top-52 z-[-1] opacity-50" />

      <Navbar />

      {/* Blog header & metadata */}
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">Published on {Moment(data.createdAt).format("MMMM Do YYYY")}</p>
        <h2 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">{data.title}</h2>
        <h3 className="my-5 max-w-lg truncate mx-auto">{data.subTitle || ""}</h3>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">{data.authorId?.fullname || "Unknown Author"}</p>
      </div>

      {/* Blog content area */}
      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        {data.image && <img src={data.image} alt="thumbnail" className="rounded-3xl mb-5 w-96 h-96 mx-auto object-cover" />}

        <div dangerouslySetInnerHTML={{ __html: data.description }} className="rich-text max-w-3xl mx-auto"></div>

        {/* LIKE BUTTON */}
        <div className="max-w-3xl mx-auto my-8 flex justify-start">
          <LikeButton initialLikes={data.likedBy ? data.likedBy.length : 0} initiallyLiked={initiallyLiked} blogId={id} isAuthenticated={isAuthenticated} axios={axios} />
        </div>

        {/* COMMENT SECTION */}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4 mt-5">
            {comments.map((comment) => (
              <div key={comment._id} className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="user icon" className="w-6" />
                  <p className="font-medium">{comment.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{comment.text}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">{Moment(comment.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD COMMENT FORM */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form onSubmit={addComment} className="flex flex-col items-start gap-4 max-w-lg">
            <input type="text" placeholder="Name" required className="w-full p-2 border border-gray-300 rounded outline-none" onChange={(e) => setName(e.target.value)} value={name} />

            <textarea placeholder="Comment" className="w-full p-2 border border-gray-300 rounded outline-none h-48 resize-none" required value={content} onChange={(e) => setContent(e.target.value)}></textarea>

            <button type="submit" className="bg-primary text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
