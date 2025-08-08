import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    isPublished: { type: Boolean, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property to get like count from likedBy array length
blogSchema.virtual("likesCount").get(function () {
  return this.likedBy ? this.likedBy.length : 0;
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
