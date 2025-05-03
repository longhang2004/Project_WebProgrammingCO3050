// src/pages/user/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import hook để lấy thông tin user
import { FaUserEdit, FaSave, FaSpinner } from 'react-icons/fa'; // Icons for editing and saving

function UserProfile() {
    const { userInfo, login: updateAuthUserInfo, loadingAuth } = useAuth(); // Lấy userInfo và hàm login (để cập nhật context)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: '',
        address: '',
        imageurl: '', // Thêm trường ảnh đại diện
        // Không bao gồm password ở đây trừ khi muốn đổi mật khẩu
    });
    const [isEditing, setIsEditing] = useState(false); // State để bật/tắt chế độ chỉnh sửa
    const [loading, setLoading] = useState(false); // State loading cho việc cập nhật
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Điền form với thông tin user khi component mount hoặc userInfo thay đổi
    useEffect(() => {
        if (userInfo) {
            setFormData({
                first_name: userInfo.first_name || '',
                last_name: userInfo.last_name || '',
                username: userInfo.username || '',
                email: userInfo.email || '',
                phone_number: userInfo.phone_number || '',
                address: userInfo.address || '',
                imageurl: userInfo.imageurl || '',
            });
        }
    }, [userInfo]); // Phụ thuộc vào userInfo từ context

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(''); // Xóa lỗi cũ khi chuyển chế độ
        setSuccess(''); // Xóa thông báo thành công cũ
        // Reset form về giá trị ban đầu nếu hủy chỉnh sửa
        if (isEditing && userInfo) {
             setFormData({
                first_name: userInfo.first_name || '',
                last_name: userInfo.last_name || '',
                username: userInfo.username || '',
                email: userInfo.email || '',
                phone_number: userInfo.phone_number || '',
                address: userInfo.address || '',
                imageurl: userInfo.imageurl || '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!userInfo || !userInfo.user_id) {
            setError('Không tìm thấy thông tin người dùng để cập nhật.');
            setLoading(false);
            return;
        }

        // --- Validation cơ bản phía Client (Thêm nếu cần) ---
        if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.phone_number || !formData.address) {
             setError('Vui lòng điền đầy đủ các trường bắt buộc.');
             setLoading(false);
             return;
         }


        try {
            // Gọi API backend để cập nhật user
            // Backend endpoint là PUT /api/user/{user_id}
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/user/${userInfo.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Thêm Authorization header nếu API yêu cầu (ví dụ: dùng JWT)
                    // 'Authorization': `Bearer ${your_auth_token}`
                },
                // Gửi các trường cần cập nhật, không gửi password trừ khi có form đổi pass riêng
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            // --- Cập nhật thành công ---
            setSuccess('Cập nhật thông tin thành công!');
            setIsEditing(false); // Tắt chế độ chỉnh sửa

            // Cập nhật lại thông tin user trong AuthContext và localStorage
            // Tạo object user mới với thông tin đã cập nhật
            const updatedUserInfo = { ...userInfo, ...formData };
            updateAuthUserInfo(updatedUserInfo); // Gọi hàm login từ context để cập nhật state và localStorage

        } catch (err) {
            console.error('Lỗi cập nhật profile:', err);
            setError(err.message || 'Đã có lỗi xảy ra khi cập nhật thông tin.');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi chưa load xong thông tin user từ context
    if (loadingAuth) {
        return <div className="text-center text-white py-10">Đang tải thông tin...</div>;
    }

    // Xử lý khi không có thông tin user (chưa đăng nhập hoặc có lỗi)
    if (!userInfo) {
        // Có thể chuyển hướng về trang đăng nhập
        // Hoặc hiển thị thông báo yêu cầu đăng nhập
         return <div className="text-center text-white py-10">Vui lòng <Link to="/login" className="text-blue-400 hover:underline">đăng nhập</Link> để xem hồ sơ.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8 flex-1">
                <h1 className="text-3xl font-bold mb-6 text-center">Hồ Sơ Cá Nhân</h1>

                <div className="max-w-2xl mx-auto bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                    {error && <p className="mb-4 text-center text-red-400 bg-red-900/50 p-3 rounded">{error}</p>}
                    {success && <p className="mb-4 text-center text-green-400 bg-green-900/50 p-3 rounded">{success}</p>}

                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={formData.imageurl || '/avt.png'} // Ảnh user hoặc ảnh mặc định
                            alt="Avatar"
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-600 mb-3"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/avt.png'; }} // Fallback
                        />
                        {isEditing && (
                             <div className="w-full mt-2">
                                <label htmlFor="imageurl" className="block text-sm font-medium text-gray-400 mb-1">Link ảnh đại diện mới</label>
                                <input
                                    type="text"
                                    id="imageurl"
                                    name="imageurl"
                                    value={formData.imageurl}
                                    onChange={handleChange}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="https://example.com/new-avatar.jpg"
                                />
                                {/* Lưu ý: Đây là cách đơn giản, nên dùng upload file thực tế */}
                            </div>
                        )}
                    </div>

                    {/* Form chỉnh sửa */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Tên và Họ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-400 mb-1">Tên</label>
                                <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} disabled={!isEditing} required className={`input-field ${!isEditing ? 'input-disabled' : ''}`} />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 mb-1">Họ</label>
                                <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!isEditing} required className={`input-field ${!isEditing ? 'input-disabled' : ''}`} />
                            </div>
                        </div>

                        {/* Tên đăng nhập */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">Tên đăng nhập</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} disabled={!isEditing} required className={`input-field ${!isEditing ? 'input-disabled' : ''}`} />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} required className={`input-field ${!isEditing ? 'input-disabled' : ''}`} />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-400 mb-1">Số điện thoại</label>
                            <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} disabled={!isEditing} required className={`input-field ${!isEditing ? 'input-disabled' : ''}`} />
                        </div>

                        {/* Địa chỉ */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Địa chỉ</label>
                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} required rows="3" className={`input-field ${!isEditing ? 'input-disabled' : ''}`}></textarea>
                        </div>

                        {/* Nút Chỉnh sửa / Lưu / Hủy */}
                        <div className="flex justify-end gap-4 pt-4">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleEditToggle}
                                        disabled={loading}
                                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" /> : <FaSave className="-ml-1 mr-2 h-4 w-4" />}
                                        Lưu thay đổi
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleEditToggle}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                                >
                                    <FaUserEdit className="-ml-1 mr-2 h-4 w-4" />
                                    Chỉnh sửa thông tin
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Có thể thêm phần đổi mật khẩu ở đây */}
                    {/* <div className="mt-8 border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
                        {/* Form đổi mật khẩu */}
                    {/*</div> */}

                </div>
            </div>
            {/* CSS cho input fields */}
            <style jsx>{`
                .input-field {
                    appearance: none;
                    border-radius: 0.375rem; /* rounded-md */
                    position: relative;
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem; /* px-3 py-2 */
                    border-width: 1px;
                    border-color: #4B5563; /* border-gray-600 */
                    background-color: #374151; /* bg-gray-700 */
                    color: #FFFFFF; /* text-white */
                    placeholder-color: #9CA3AF; /* placeholder-gray-400 */
                }
                .input-field:focus {
                    outline: none;
                    --tw-ring-color: #6366F1; /* focus:ring-indigo-500 */
                    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
                    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
                    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
                    border-color: #6366F1; /* focus:border-indigo-500 */
                    z-index: 10;
                }
                .input-disabled {
                    background-color: #4B5563; /* bg-gray-600 */
                    color: #D1D5DB; /* text-gray-300 */
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                .input-field:-webkit-autofill,
                .input-field:-webkit-autofill:hover,
                .input-field:-webkit-autofill:focus,
                .input-field:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #374151 inset !important; /* Giữ nền tối khi autofill */
                    -webkit-text-fill-color: #FFFFFF !important; /* Giữ chữ trắng khi autofill */
                }

            `}</style>
        </div>
    );
}

export default UserProfile;

