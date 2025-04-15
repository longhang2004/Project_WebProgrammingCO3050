import { Link } from 'react-router-dom';

function BlogList() {
  // Giả sử đây là danh sách các bài viết của bạn
  const blogs = [
    { id: 1, title: "Blog 1", description: "Mô tả blog 1" },
    { id: 2, title: "Blog 2", description: "Mô tả blog 2" },
    { id: 3, title: "Blog 3", description: "Mô tả blog 3" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6">Danh sách bài viết</h2>
      <ul className="space-y-4">
        {blogs.map(blog => (
          <li key={blog.id} className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
            <Link to={`/blog/${blog.id}`}>
              <h3 className="text-xl font-bold text-blue-600">{blog.title}</h3>
              <p className="text-gray-700">{blog.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;