// File: frontend/src/pages/admin/AdminAddEditPostPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner, FaImage, FaEye, FaEyeSlash } from 'react-icons/fa';
// Cân nhắc dùng một thư viện Rich Text Editor như TinyMCE hoặc ReactQuill
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // Import CSS cho editor

const AdminAddEditPostPage = () => {
    const { postId } = useParams(); // Lấy postId từ URL nếu là trang sửa
    const navigate = useNavigate();
    const isEditing = Boolean(postId);

    const initialFormData = {
        title: '',
        slug: '',
        excerpt: '',
        content: '', // Sẽ chứa HTML/Markdown từ editor
        featured_image_url: '',
        status: 'draft', // Mặc định là nháp
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    // const [contentHtml, setContentHtml] = useState(''); // State cho Rich Text Editor

    // Hàm tạo slug tự động (đơn giản)
    const generateSlug = (title) => {
        if (!title) return '';
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
            .replace(/[\s_-]+/g, '-') // Thay khoảng trắng, gạch dưới bằng gạch ngang
            .replace(/^-+|-+$/g, ''); // Xóa gạch ngang ở đầu/cuối
    };


    const fetchPostData = useCallback(async () => {
        if (!isEditing) { setLoading(false); return; }
        setLoading(true); setFormError('');
        const token = localStorage.getItem('authToken');
        try {
            // API này cần trả về chi tiết bài viết, kể cả bản nháp cho admin
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/post/${postId}?admin_view=true`, {
                 headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Không thể tải dữ liệu bài viết.');
            const result = await response.json();
            if (result.success && result.data) {
                const postData = result.data;
                setFormData({
                    title: postData.title || '',
                    slug: postData.slug || '',
                    excerpt: postData.excerpt || '',
                    content: postData.content || '',
                    featured_image_url: postData.featured_image_url || '',
                    status: postData.status || 'draft',
                });
                setImagePreview(postData.featured_image_url || '');
                // setContentHtml(postData.content || ''); // Cho Rich Text Editor
            } else {
                throw new Error(result.message || 'Lỗi tải dữ liệu bài viết.');
            }
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId, isEditing]);

    useEffect(() => {
        if (isEditing) {
            fetchPostData();
        }
    }, [isEditing, fetchPostData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'imageurl') {
            setImagePreview(value);
        }
        // Tự động tạo slug khi tiêu đề thay đổi (chỉ khi đang thêm mới hoặc slug rỗng)
        if (name === 'title' && (!isEditing || !formData.slug)) {
            setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
        }
    };

    // const handleContentChange = (html) => { // Cho Rich Text Editor
    //     setContentHtml(html);
    //     setFormData(prev => ({ ...prev, content: html }));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setFormError(''); setFormSuccess('');
        const token = localStorage.getItem('authToken');

        // Validate cơ bản
        if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
            setFormError("Tiêu đề, Slug và Nội dung không được để trống.");
            setLoading(false);
            return;
        }

        const submissionData = { ...formData };
        // submissionData.content = contentHtml; // Nếu dùng Rich Text Editor

        const url = isEditing
            ? `http://localhost/Project_WebProgrammingCO3050/backend/api/post/${postId}` // API PUT /api/post/{id}
            : 'http://localhost/Project_WebProgrammingCO3050/backend/api/post';      // API POST /api/post
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(submissionData),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi khi ${isEditing ? 'cập nhật' : 'tạo mới'} bài viết.`);
            }
            setFormSuccess(`Bài viết đã được ${isEditing ? 'cập nhật' : 'tạo mới'} thành công!`);
            if (!isEditing && result.data?.post_id) {
                navigate(`/admin/posts/edit/${result.data.post_id}`); // Chuyển đến trang sửa sau khi tạo
            } else if (isEditing) {
                fetchPostData(); // Tải lại dữ liệu sau khi sửa
            }

        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-3xl text-blue-500" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    {isEditing ? `Sửa Bài Viết (ID: ${postId})` : 'Tạo Bài Viết Mới'}
                </h2>
                <Link to="/admin/posts" className="text-blue-500 hover:text-blue-700 hover:underline">
                    &larr; Quay lại danh sách
                </Link>
            </div>

            {formError && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>}
            {formSuccess && <p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">{formSuccess}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField label="Tiêu đề bài viết" name="title" value={formData.title} onChange={handleChange} required />
                <InputField label="Slug (URL thân thiện)" name="slug" value={formData.slug} onChange={handleChange} required placeholder="VD: ten-bai-viet-moi"/>
                <InputField label="URL Ảnh đại diện" name="featured_image_url" value={formData.featured_image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                {imagePreview && ( <div className="mt-2"><img src={imagePreview} alt="Xem trước ảnh" className="h-40 w-auto object-contain border rounded-md" /></div> )}

                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">Tóm tắt (Excerpt)</label>
                    <textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" className="input-field" placeholder="Đoạn tóm tắt ngắn gọn..."></textarea>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Nội dung bài viết</label>
                    {/* Thay thế textarea này bằng Rich Text Editor nếu muốn */}
                    <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows="15" className="input-field" placeholder="Viết nội dung của bạn ở đây... (Hỗ trợ HTML hoặc Markdown tùy theo cấu hình backend)"></textarea>
                    {/* <ReactQuill theme="snow" value={contentHtml} onChange={handleContentChange} modules={...} formats={...} /> */}
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="input-field">
                        <option value="draft">Nháp (Draft)</option>
                        <option value="published">Đã xuất bản (Published)</option>
                        <option value="archived">Lưu trữ (Archived)</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Link to="/admin/posts" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Hủy</Link>
                    <button type="submit" disabled={loading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        {loading ? <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" /> : <FaSave className="-ml-1 mr-2 h-4 w-4" />}
                        {isEditing ? 'Lưu thay đổi' : 'Đăng bài viết'}
                    </button>
                </div>
            </form>
            <style jsx>{`
                .input-field {
                    appearance: none; border-radius: 0.375rem; position: relative; display: block;
                    width: 100%; padding: 0.5rem 0.75rem; border-width: 1px; border-color: #D1D5DB; /* gray-300 */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-field:focus {
                    outline: none; --tw-ring-color: #4F46E5; /* indigo-500 */
                    border-color: #4F46E5;
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
                }
            `}</style>
        </div>
    );
};

// Component InputField dùng chung
const InputField = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} name={name} id={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="input-field" />
    </div>
);

export default AdminAddEditPostPage;
