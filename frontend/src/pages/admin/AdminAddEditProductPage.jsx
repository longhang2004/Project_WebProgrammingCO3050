// File: frontend/src/pages/admin/AdminAddEditProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave, FaTimes, FaSpinner, FaImage, FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

// Giả sử đây là các loại sản phẩm bạn có
const PRODUCT_TYPES = [
    { value: '', label: 'Chọn loại sản phẩm...' },
    { value: 'smartphone', label: 'Điện thoại Smartphone' },
    { value: 'laptop', label: 'Laptop' },
    // Thêm các loại khác nếu có
];

const AdminAddEditProductPage = () => {
    const { productId } = useParams(); // Lấy productId từ URL nếu là trang sửa
    const navigate = useNavigate();
    const isEditing = Boolean(productId);

    const initialFormData = {
        name: '',
        description: '', // Nên dùng Rich Text Editor cho trường này
        price: '',
        stock: '',
        rated_stars: '0.0', // Mặc định
        warranty_period: '', // tháng
        manufacturer: '',
        warranty_policy: '',
        imageurl: '',
        type: '', // 'smartphone' hoặc 'laptop'
        // Chi tiết cho smartphone
        processor: '',
        camera: '',
        battery_sp: '', // Đặt tên khác để không trùng với battery_lp
        screen_description_sp: '',
        RAM_ROM: '',
        sim_connectivity: '',
        // Chi tiết cho laptop
        CPU: '',
        GPU: '',
        RAM_lp: '', // Đặt tên khác
        storage_lp: '', // Đặt tên khác
        screen_description_lp: '',
        battery_lp: '',
        ports: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [productType, setProductType] = useState(''); // 'smartphone' or 'laptop'

    const fetchProductData = useCallback(async () => {
        if (!isEditing) {
             setLoading(false);
             return;
        }
        setLoading(true);
        setFormError('');
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}?admin_view=true`, {
                 headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Không thể tải dữ liệu sản phẩm.');
            const result = await response.json();
            if (result.success && result.data) {
                const productData = result.data;
                const details = productData.details || {}; // details có thể là null

                setFormData({
                    name: productData.name || '',
                    description: productData.description || '',
                    price: productData.price || '',
                    stock: productData.stock || '',
                    rated_stars: productData.rated_stars || '0.0',
                    warranty_period: productData.warranty_period || '',
                    manufacturer: productData.manufacturer || '',
                    warranty_policy: productData.warranty_policy || '',
                    imageurl: productData.imageurl || '',
                    type: details.type || '',
                    // Smartphone details
                    processor: details.processor || '',
                    camera: details.camera || '',
                    battery_sp: details.battery || '', // Giả sử details.battery là chung, cần phân biệt
                    screen_description_sp: details.screen_description || '',
                    RAM_ROM: details.RAM_ROM || '',
                    sim_connectivity: details.sim_connectivity || '',
                    // Laptop details
                    CPU: details.CPU || '',
                    GPU: details.GPU || '',
                    RAM_lp: details.RAM || '',
                    storage_lp: details.storage || '',
                    screen_description_lp: details.screen_description_lp || details.screen_description || '', // Ưu tiên _lp
                    battery_lp: details.battery_lp || details.battery || '', // Ưu tiên _lp
                    ports: details.ports || '',
                });
                setImagePreview(productData.imageurl || '');
                setProductType(details.type || '');
            } else {
                throw new Error(result.message || 'Lỗi tải dữ liệu sản phẩm.');
            }
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    }, [productId, isEditing]);

    useEffect(() => {
        if (isEditing) {
            fetchProductData();
        }
    }, [isEditing, fetchProductData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'imageurl') {
            setImagePreview(value);
        }
        if (name === 'type') {
            setProductType(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError('');
        setFormSuccess('');
        const token = localStorage.getItem('authToken');

        // Chuẩn bị dữ liệu gửi đi
        const submissionData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
            rated_stars: parseFloat(formData.rated_stars),
            warranty_period: parseInt(formData.warranty_period, 10) || 0,
            manufacturer: formData.manufacturer,
            warranty_policy: formData.warranty_policy,
            imageurl: formData.imageurl,
            type: productType, // Gửi productType đã chọn
            details: {}
        };

        if (productType === 'smartphone') {
            submissionData.details = {
                processor: formData.processor,
                camera: formData.camera,
                battery: formData.battery_sp, // Sử dụng đúng tên
                screen_description: formData.screen_description_sp,
                RAM_ROM: formData.RAM_ROM,
                sim_connectivity: formData.sim_connectivity,
            };
        } else if (productType === 'laptop') {
            submissionData.details = {
                CPU: formData.CPU,
                GPU: formData.GPU,
                RAM: formData.RAM_lp,
                storage: formData.storage_lp,
                screen_description: formData.screen_description_lp,
                battery: formData.battery_lp,
                ports: formData.ports,
            };
        }
        // Xóa details nếu productType rỗng
        if (!productType) {
            delete submissionData.details;
        }


        const url = isEditing
            ? `http://localhost/Project_WebProgrammingCO3050/backend/api/product/${productId}`
            : 'http://localhost/Project_WebProgrammingCO3050/backend/api/product';
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
                throw new Error(result.message || `Lỗi khi ${isEditing ? 'cập nhật' : 'thêm mới'} sản phẩm.`);
            }
            setFormSuccess(`Sản phẩm đã được ${isEditing ? 'cập nhật' : 'thêm mới'} thành công!`);
            if (!isEditing && result.data?.product_id) {
                // Nếu là thêm mới thành công, chuyển hướng đến trang sửa sản phẩm đó
                navigate(`/admin/products/edit/${result.data.product_id}`);
            } else if (isEditing) {
                // Nếu sửa thành công, có thể fetch lại dữ liệu để đảm bảo form được cập nhật
                fetchProductData();
            }

        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="flex justify-center items-center h-64"><FaSpinner className="animate-spin text-3xl text-blue-500" /></div>;

    const renderSpecificFields = () => {
        if (productType === 'smartphone') {
            return (
                <>
                    <h3 className="text-lg font-semibold text-gray-600 mt-6 mb-3 col-span-1 md:col-span-2">Chi tiết Smartphone</h3>
                    <InputField label="Vi xử lý (Processor)" name="processor" value={formData.processor} onChange={handleChange} />
                    <InputField label="Camera" name="camera" value={formData.camera} onChange={handleChange} />
                    <InputField label="Pin (Smartphone)" name="battery_sp" value={formData.battery_sp} onChange={handleChange} placeholder="VD: 5000mAh, Sạc nhanh 25W"/>
                    <InputField label="Mô tả màn hình (Smartphone)" name="screen_description_sp" value={formData.screen_description_sp} onChange={handleChange} placeholder="VD: 6.7 inch, AMOLED, 120Hz"/>
                    <InputField label="RAM/ROM" name="RAM_ROM" value={formData.RAM_ROM} onChange={handleChange} placeholder="VD: 8GB/128GB"/>
                    <InputField label="SIM & Kết nối" name="sim_connectivity" value={formData.sim_connectivity} onChange={handleChange} placeholder="VD: 2 Nano SIM, 5G"/>
                </>
            );
        } else if (productType === 'laptop') {
            return (
                <>
                    <h3 className="text-lg font-semibold text-gray-600 mt-6 mb-3 col-span-1 md:col-span-2">Chi tiết Laptop</h3>
                    <InputField label="CPU" name="CPU" value={formData.CPU} onChange={handleChange} />
                    <InputField label="GPU (Card đồ họa)" name="GPU" value={formData.GPU} onChange={handleChange} />
                    <InputField label="RAM (Laptop)" name="RAM_lp" value={formData.RAM_lp} onChange={handleChange} placeholder="VD: 16GB DDR5"/>
                    <InputField label="Ổ cứng (Storage)" name="storage_lp" value={formData.storage_lp} onChange={handleChange} placeholder="VD: 512GB SSD NVMe"/>
                    <InputField label="Mô tả màn hình (Laptop)" name="screen_description_lp" value={formData.screen_description_lp} onChange={handleChange} placeholder="VD: 15.6 inch, FHD IPS, 144Hz"/>
                    <InputField label="Pin (Laptop)" name="battery_lp" value={formData.battery_lp} onChange={handleChange} placeholder="VD: 4-cell, 70Wh"/>
                    <InputField label="Cổng kết nối" name="ports" value={formData.ports} onChange={handleChange} placeholder="VD: USB-C, HDMI, USB 3.0"/>
                </>
            );
        }
        return null;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-700">
                    {isEditing ? `Sửa Sản phẩm (ID: ${productId})` : 'Thêm Sản phẩm Mới'}
                </h2>
                <Link to="/admin/products" className="text-blue-500 hover:text-blue-700 hover:underline">
                    &larr; Quay lại danh sách
                </Link>
            </div>

            {formError && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>}
            {formSuccess && <p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">{formSuccess}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thông tin chung */}
                    <InputField label="Tên Sản phẩm" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="Giá (USD)" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                    <InputField label="Số lượng tồn kho" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    <InputField label="Nhà sản xuất" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
                    <InputField label="Thời gian bảo hành (tháng)" name="warranty_period" type="number" value={formData.warranty_period} onChange={handleChange} />
                    <InputField label="Đánh giá sao (0.0 - 5.0)" name="rated_stars" type="number" step="0.1" min="0" max="5" value={formData.rated_stars} onChange={handleChange} />

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Mô tả chi tiết sản phẩm... (Hỗ trợ HTML nếu backend xử lý)"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="warranty_policy" className="block text-sm font-medium text-gray-700 mb-1">Chính sách bảo hành</label>
                        <textarea id="warranty_policy" name="warranty_policy" value={formData.warranty_policy} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Nội dung chính sách bảo hành..."></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <InputField label="URL Hình ảnh chính" name="imageurl" value={formData.imageurl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                        {imagePreview && (
                            <div className="mt-2">
                                <img src={imagePreview} alt="Xem trước" className="h-32 w-auto object-contain border rounded-md" />
                            </div>
                        )}
                    </div>

                     {/* Chọn loại sản phẩm */}
                     <div className="md:col-span-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
                        <select
                            id="type"
                            name="type"
                            value={productType}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {PRODUCT_TYPES.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Render các trường chi tiết dựa trên loại sản phẩm */}
                    {renderSpecificFields()}
                </div>


                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Link to="/admin/products" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Hủy
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" /> : <FaSave className="-ml-1 mr-2 h-4 w-4" />}
                        {isEditing ? 'Lưu thay đổi' : 'Thêm Sản phẩm'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Component InputField đơn giản
const InputField = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '', step, min, max }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);

export default AdminAddEditProductPage;
