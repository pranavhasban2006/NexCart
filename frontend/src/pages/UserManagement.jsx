import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/admin/users', 
                { name, email, password, role }
            );
            toast.success("User added successfully!");
            setName('');
            setEmail('');
            setPassword('');
            setRole('customer');
            fetchUsers(); // Refresh list
        } catch (err) {
            console.error("Error adding user:", err);
            toast.error(err.response?.data?.message || "Failed to add user.");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axiosInstance.put('/api/admin/users', 
                { id: userId, role: newRole }
            );
            toast.success("User role updated successfully!");
            fetchUsers(); // Refresh list
        } catch (err) {
            console.error("Error updating role:", err);
            toast.error(err.response?.data?.message || "Failed to update role.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axiosInstance.delete(`/api/admin/users?id=${id}`);
                toast.success("User deleted successfully!");
                fetchUsers(); // Refresh list
            } catch (err) {
                console.error("Error deleting user:", err);
                toast.error(err.response?.data?.message || "Failed to delete user.");
            }
        }
    };

    if (loading) return <div className="p-8 text-gray-500 font-medium animate-pulse text-center">Loading users...</div>;
    if (error) return <div className="p-8 text-red-500 font-bold border border-red-200 bg-red-50 rounded-xl m-4">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-left">User Management</h1>
            </div>

            {/* Add New User Form */}
            <div className="mb-12 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Add New User</h2>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white cursor-pointer"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <button
                            type="submit"
                            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md active:scale-95"
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>

            {/* Users List Table Header Style Match */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f4f5f7]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">
                                    NAME
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                                    EMAIL
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                                    ROLE
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-5 font-bold text-gray-800">{user.name}</td>
                                        <td className="px-6 py-5 text-gray-500">{user.email}</td>
                                        <td className="px-6 py-5 text-gray-500 font-bold uppercase tracking-tighter">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="border border-gray-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-black cursor-pointer bg-white"
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-5 text-gray-500">
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-white bg-red-500 hover:bg-red-700 font-bold px-4 py-2 rounded-lg transition-all text-xs shadow-sm hover:shadow-md active:scale-95"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
