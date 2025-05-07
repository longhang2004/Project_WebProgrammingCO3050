// File: frontend/src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaUserPlus, FaSearch, FaSpinner, FaExclamationTriangle, FaUserShield, FaUser } from 'react-icons/fa';

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    const fetchUsersAdmin = useCallback(async (page = 1, search = '') => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        try {
            let apiUrl = `http://localhost/Project_WebProgrammingCO3050/backend/api/user?page=${page}&per_page=${usersPerPage}&admin_view=true`; // Backend cần hỗ trợ admin_view
            if (search) {
                apiUrl += `&search=${encodeURIComponent(search)}`; // Backend cần hỗ trợ search
            }
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData?.message || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Giả sử API trả về cấu trúc { success: true, data: { data: [], pagination: {} } }
            if (data.success && data.data?.data) {
                setUsers(data.data.data); // API cần trả về cả is_admin và membership_level
                setTotalPages(data.data.pagination?.total_pages || 1);
                setCurrentPage(data.data.pagination?.current_page || 1);
            } else {
                throw new Error(data.message || 'Không thể tải danh sách người dùng.');
            }
        } catch (err) {
            console.error("Error fetching admin users:", err);
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsersAdmin(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchUsersAdmin]);


    const handleRoleChange = async (userId, currentIsAdmin) => {
        // Logic thay đổi vai trò (ví dụ: gọi API PUT /api/user/{id}/role)
        // Cần xác nhận và xử lý cẩn thận
        const action = currentIsAdmin ? "gỡ quyền admin" : "cấp quyền admin";
        if (!window.confirm(`Bạn có chắc muốn ${action} cho người dùng ID ${userId} không?`)) return;

        const token = localStorage.getItem('authToken');
        const newRoleEndpoint = currentIsAdmin
            ? `http://localhost/Project_WebProgrammingCO3050/backend/api/user/${userId}/revoke_admin` // Cần tạo API này
            : `http://localhost/Project_WebProgrammingCO3050/backend/api/user/${userId}/make_admin`;  // API này đã có

        try {
            const response = await fetch(newRoleEndpoint, {
                method: 'PUT', // Hoặc POST tùy theo thiết kế API của bạn
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi khi thay đổi vai trò.`);
            }
            alert(`Thay đổi vai trò thành công!`);
            fetchUsersAdmin(currentPage, searchTerm); // Tải lại danh sách
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        }
    };

    const handleDeleteUser = async (userId, username) => {
         if (!window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN người dùng "${username}" (ID: ${userId}) không? Hành động này không thể hoàn tác.`)) return;
         const token = localStorage.getItem('authToken');
         try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/user/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || `Lỗi xóa người dùng.`);
            }
            alert('Xóa người dùng thành công!');
            fetchUsersAdmin(currentPage, searchTerm);
         } catch (err) {
            alert(`Lỗi: ${err.message}`);
         }
    };


    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) { setCurrentPage(newPage); } };
    const renderPagination = () => { /* ... (Tương tự AdminProductListPage) ... */ };


    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quản lý Người dùng</h2>
             {/* Thanh tìm kiếm */}
            <div className="mb-4">
                <div className="relative">
                    <input type="text" placeholder="Tìm người dùng (username, email, tên)..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {loading && <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>}
            {error && !loading && ( <div className="text-center py-10 bg-red-50 text-red-600 border border-red-300 rounded-lg"> <FaExclamationTriangle className="text-3xl mx-auto mb-2"/> <p className="font-semibold">Lỗi tải dữ liệu: {error}</p> </div> )}
            {!loading && !error && users.length === 0 && ( <p className="text-center text-gray-500 py-10">Không tìm thấy người dùng nào.</p> )}

            {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avatar</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ Tên</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.user_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.user_id}</td>
                                    <td className="px-4 py-3"><img src={user.imageurl || '/avt.png'} alt={user.username} className="w-8 h-8 rounded-full object-cover"/></td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{user.first_name} {user.last_name}</td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        {user.is_admin ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Admin</span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">User</span>
                                        )}
                                        {/* Hiển thị membership_level nếu có */}
                                        {user.membership_level && (
                                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.membership_level === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                                                user.membership_level === 'premium' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.membership_level}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm font-medium space-x-2">
                                        {/* <Link to={`/admin/users/edit/${user.user_id}`} className="text-indigo-600 hover:text-indigo-900" title="Sửa thông tin"> <FaEdit /> </Link> */}
                                        <button onClick={() => handleRoleChange(user.user_id, user.is_admin)} className={user.is_admin ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"} title={user.is_admin ? "Gỡ quyền Admin" : "Cấp quyền Admin"}>
                                            {user.is_admin ? <FaUser /> : <FaUserShield />}
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.user_id, user.username)} className="text-red-600 hover:text-red-900" title="Xóa người dùng"> <FaTrashAlt /> </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {renderPagination()}
        </div>
    );
};

export default AdminUserListPage;
