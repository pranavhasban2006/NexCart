import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'sonner';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axiosInstance.put(`/api/admin/orders/${id}`, 
                { status: newStatus.toLowerCase() }
            );
            toast.success(`Order status updated to ${newStatus}!`);
            fetchOrders();
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axiosInstance.delete(`/api/admin/orders/${id}`);
                toast.success("Order deleted successfully!");
                fetchOrders();
            } catch (err) {
                console.error("Error deleting order:", err);
                toast.error(err.response?.data?.message || "Failed to delete order.");
            }
        }
    };

    if (loading) return <div className="p-8 text-gray-500 font-medium animate-pulse text-center">Loading orders...</div>;
    if (error) return <div className="p-8 text-red-500 font-bold border border-red-200 bg-red-50 rounded-xl m-4 text-center">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-12 xl:p-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight text-left">Order Management</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f4f5f7]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">ORDER ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">CUSTOMER</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">TOTAL PRICE</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">STATUS</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left font-serif">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-5 font-bold text-gray-700 text-xs">{order._id}</td>
                                        <td className="px-6 py-5 text-gray-500">{order.user?.name || 'Guest User'}</td>
                                        <td className="px-6 py-5 text-gray-500 font-bold">
                                            ${order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <select 
                                                value={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border border-gray-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black text-xs font-semibold bg-white shadow-sm cursor-pointer uppercase tracking-tighter"
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-5 space-x-2">
                                            <button 
                                                onClick={() => handleStatusChange(order._id, 'Delivered')}
                                                className="bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                                            >
                                                Mark as Delivered
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="text-white bg-red-500 hover:bg-red-700 font-bold px-4 py-2 rounded-lg transition-all text-xs shadow-sm hover:shadow-md active:scale-95"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;
