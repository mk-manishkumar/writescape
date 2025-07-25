import React, { useEffect, useState, useCallback } from "react";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");

  const { axios } = useAppContext();

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/admin/comments");
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="flex-1 pt-6 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex items-center justify-between max-w-3xl">
        <h2>Comments</h2>

        <div className="flex gap-4">
          <button onClick={() => setFilter("Approved")} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === "Approved" ? "text-primary" : "text-gray-700"}`}>
            Approved
          </button>
          <button onClick={() => setFilter("Not Approved")} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === "Not Approved" ? "text-primary" : "text-gray-700"}`}>
            Not Approved
          </button>
        </div>
      </div>

      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase text-left">
            <tr>
              <th scope="col" className="px-6 py-3">
                Blog Title & Comment
              </th>
              <th scope="col" className="px-6 py-3 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {comments
              .filter((comment) => (filter === "Approved" ? comment.isApproved === true : comment.isApproved === false))
              .map((comment, index) => (
                <CommentTableItem key={comment._id} comment={comment} index={index + 1} fetchComments={fetchComments} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
