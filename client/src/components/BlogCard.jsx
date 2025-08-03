import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;

  return (
    <Link to={`/blog/${_id}`} className="cursor-pointer w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300">
      <div>
        <img
          src={image || "/placeholder-image.jpg"}
          alt={title || "Blog post"}
          className="aspect-video object-cover w-full"
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg"; 
          }}
        />
        <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">{category || "Uncategorized"}</span>
        <div className="p-5">
          <h5 className="mb-2 font-medium text-gray-900">{title}</h5>
          <p className="mb-3 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: (description || "").slice(0, 80) }}></p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
