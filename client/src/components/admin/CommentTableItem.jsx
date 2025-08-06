import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);
  const { token } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/admin/approve-comment",
        { id: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve comment");
    }
  };

  const deleteComment = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "/api/v1/admin/delete-comment",
        { id: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog?.title || "N/A"}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">{BlogDate.toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!comment.isApproved ? (
            <button onClick={approveComment} className="cursor-pointer">
              <img src={assets.tick_icon} className="w-5 hover:scale-110 transition-all" alt="Approve" />
            </button>
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">Approved</p>
          )}
          <button onClick={deleteComment} className="cursor-pointer">
            <img src={assets.bin_icon} className="w-5 hover:scale-110 transition-all" alt="Delete" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
