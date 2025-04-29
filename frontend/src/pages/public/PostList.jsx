

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PostList() {
  const [allPosts, setAllPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // Số bài viết mỗi trang


  
  /*
  const fetchPosts = async (currentPage) => {
    try {
      const response = await axios.get(`/backend/api/post.php?page=${currentPage}&limit=${limit}`);
      const newPosts = response.data;
      setPosts(newPosts);
      setHasMore(newPosts.length === limit);
    } catch (error) {
      console.error("Lỗi khi fetch post:", error);
    }
  };
  */

  // Lấy toàn bộ dữ liệu từ mock file
  const fetchPosts = async () => {
    try {
      const response = await axios.get('/public/mock-posts.json'); // đường dẫn tính từ public/
      setAllPosts(response.data);
    } catch (error) {
      console.error("Lỗi khi fetch post từ mock file:", error);
    }
  };

  // Cập nhật dữ liệu của trang hiện tại dựa trên `page` và `limit`
  const updatePageData = () => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const currentPosts = allPosts.slice(startIndex, endIndex);
    setPosts(currentPosts);
    setHasMore(endIndex < allPosts.length); 
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    updatePageData();
  }, [allPosts, page]);

  const handleNextPage = () => {
    if (hasMore) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6">Danh sách bài viết</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.post_id} className="border p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
            <Link to={`/post/${post.post_id}`}>
              <h3 className="text-xl font-bold text-blue-600">Bài viết #{post.post_id}</h3>
              <p className="text-gray-700">{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">Tạo lúc: {new Date(post.created_at).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>Trang {page}</span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default PostList;