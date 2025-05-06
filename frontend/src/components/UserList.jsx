import { useState, useEffect } from 'react';
import api from '../api/api';

function UserList({ onEdit, onDelete }) {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState('');

  // Lấy danh sách người dùng hoặc tìm theo user_id
  const fetchUsers = async () => {
    try {
      const url = searchId ? `/user?user_id=${searchId}` : '/users';
      const response = await api.get(url);
      setUsers(Array.isArray(response.data.users) ? response.data.users : [response.data.users]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by User ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        />
        <button
          onClick={fetchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Membership</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-100">
              <td className="p-2 border">{user.user_id}</td>
              <td className="p-2 border">{`${user.first_name} ${user.last_name}`}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone_number}</td>
              <td className="p-2 border">{user.membership_level || 'N/A'}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => onEdit(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(user.user_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;