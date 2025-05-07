// src/components/QuickCategories.jsx (Hoặc sửa trực tiếp trong HomePage nếu không tách file)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaLaptop, FaMobileAlt } from 'react-icons/fa';

function QuickCategories() {
    const categories = [
        { name: "Điện thoại", icon: FaMobileAlt, link: "/phone", color: "text-primary" }, // Sử dụng màu theme
        { name: "Laptop", icon: FaLaptop, link: "/laptop", color: "text-secondary" }, // Sử dụng màu theme
        // Bỏ các danh mục khác
    ];

    return (
        <section className="bg-surface py-6 border-b border-border">
            <div className="container mx-auto px-4">
                {/* Sử dụng flex để căn giữa 2 mục */}
                <div className="flex justify-center flex-wrap gap-8 md:gap-16 text-center">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <Link key={cat.name} to={cat.link} className="group block p-3 rounded-lg hover:bg-surface-accent transition-colors duration-200 w-32 md:w-40"> {/* Giới hạn chiều rộng */}
                                <Icon className={`text-3xl md:text-4xl mx-auto mb-2 ${cat.color} group-hover:scale-110 transition-transform duration-200`} />
                                <span className="text-sm font-medium text-text-main group-hover:text-primary">{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default QuickCategories; // Export nếu tách file