// File: frontend/src/pages/admin/AdminDashboardPage.jsx
import React from 'react';

const AdminDashboardPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ví dụ các thẻ thống kê */}
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Tổng Sản phẩm</h3>
                    <p className="text-3xl font-bold">150</p> {/* Thay bằng dữ liệu thật */}
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Đơn hàng mới</h3>
                    <p className="text-3xl font-bold">12</p> {/* Thay bằng dữ liệu thật */}
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Người dùng</h3>
                    <p className="text-3xl font-bold">85</p> {/* Thay bằng dữ liệu thật */}
                </div>
                <div className="bg-indigo-500 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold">Bài viết Blog</h3>
                    <p className="text-3xl font-bold">25</p> {/* Thay bằng dữ liệu thật */}
                </div>
            </div>
            {/* Thêm các biểu đồ hoặc thông tin khác nếu cần */}
        </div>
    );
};

export default AdminDashboardPage;
