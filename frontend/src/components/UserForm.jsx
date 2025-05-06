import { useState, useEffect } from 'react';
import api from '../api/api';

function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    address: '',
    imageurl: '',
    membership_level: 'basic',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        imageurl: user.imageurl || '',
        membership_level: user.membership_level || 'basic',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/user/${user.user_id}`, formData);
      onSave();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Edit User</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="p-2 border rounded"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="p-2 border rounded"
        />
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="p-2 border rounded"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
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
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="p-2 border rounded col-span-2"
        />
        <select
          name="membership_level"
          value={formData.membership_level}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="gold">Gold</option>
        </select>
      </div>
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

export default UserForm;