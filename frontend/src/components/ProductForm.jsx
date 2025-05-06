import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/api';

function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    manufacturer: '',
    warranty_period: '',
    warranty_policy: '',
    imageurl: '',
    type: 'smartphone',
    smartphone: {
      processor: '',
      camera: '',
      battery: '',
      screen_description: '',
      RAM_ROM: '',
      sim_connectivity: '',
    },
    laptop: {
      CPU: '',
      GPU: '',
      RAM: '',
      storage: '',
      screen_description: '',
      battery: '',
      ports: '',
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        type: product.type || 'smartphone',
        smartphone: product.smartphone || formData.smartphone,
        laptop: product.laptop || formData.laptop,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('smartphone.') || name.startsWith('laptop.')) {
      const [type, field] = name.split('.');
      setFormData({
        ...formData,
        [type]: { ...formData[type], [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (product) {
        await api.put(`/api/product/${product.product_id}`, formData);
      } else {
        await api.post('/api/product', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'Create Product'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 border rounded"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
        />
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="p-2 border rounded"
        />
        <input
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          placeholder="Manufacturer"
          className="p-2 border rounded"
        />
        <input
          name="warranty_period"
          type="number"
          value={formData.warranty_period}
          onChange={handleChange}
          placeholder="Warranty Period (months)"
          className="p-2 border rounded"
        />
        <input
          name="imageurl"
          value={formData.imageurl}
          onChange={handleChange}
          placeholder="Image URL"
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded col-span-2"
        />
        <textarea
          name="warranty_policy"
          value={formData.warranty_policy}
          onChange={handleChange}
          placeholder="Warranty Policy"
          className="p-2 border rounded col-span-2"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="smartphone">Smartphone</option>
          <option value="laptop">Laptop</option>
        </select>
      </div>
      {formData.type === 'smartphone' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            name="smartphone.processor"
            value={formData.smartphone.processor}
            onChange={handleChange}
            placeholder="Processor"
            class MembershipLevel="p-2 border rounded"
          />
          <input
            name="smartphone.camera"
            value={formData.smartphone.camera}
            onChange={handleChange}
            placeholder="Camera"
            className="p-2 border rounded"
          />
          <input
            name="smartphone.battery"
            value={formData.smartphone.battery}
            onChange={handleChange}
            placeholder="Battery"
            className="p-2 border rounded"
          />
          <input
            name="smartphone.screen_description"
            value={formData.smartphone.screen_description}
            onChange={handleChange}
            placeholder="Screen Description"
            className="p-2 border rounded"
          />
          <input
            name="smartphone.RAM_ROM"
            value={formData.smartphone.RAM_ROM}
            onChange={handleChange}
            placeholder="RAM/ROM"
            className="p-2 border rounded"
          />
          <input
            name="smartphone.sim_connectivity"
            value={formData.smartphone.sim_connectivity}
            onChange={handleChange}
            placeholder="SIM Connectivity"
            className="p-2 border rounded"
          />
        </div>
      )}
      {formData.type === 'laptop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            name="laptop.CPU"
            value={formData.laptop.CPU}
            onChange={handleChange}
            placeholder="CPU"
            className="p-2 border rounded"
          />
          <input
            name="laptop.GPU"
            value={formData.laptop.GPU}
            onChange={handleChange}
            placeholder="GPU"
            className="p-2 border rounded"
          />
          <input
            name="laptop.RAM"
            value={formData.laptop.RAM}
            onChange={handleChange}
            placeholder="RAM"
            className="p-2 border rounded"
          />
          <input
            name="laptop.storage"
            value={formData.laptop.storage}
            onChange={handleChange}
            placeholder="Storage"
            className="p-2 border rounded"
          />
          <input
            name="laptop.screen_description"
            value={formData.laptop.screen_description}
            onChange={handleChange}
            placeholder="Screen Description"
            className="p-2 border rounded"
          />
          <input
            name="laptop.battery"
            value={formData.laptop.battery}
            onChange={handleChange}
            placeholder="Battery"
            className="p-2 border rounded"
          />
          <input
            name="laptop.ports"
            value={formData.laptop.ports}
            onChange={handleChange}
            placeholder="Ports"
            className="p-2 border rounded"
          />
        </div>
      )}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ProductForm;