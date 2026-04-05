import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/stats');
        setStats({
          totalRevenue: response.data.totalRevenue,
          totalOrders: response.data.totalOrders,
          totalProducts: response.data.totalProducts
        });
        setRecentOrders(response.data.recentOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, actionText: '', actionLink: '' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), actionText: 'Manage Orders', actionLink: '/admin/orders' },
    { title: 'Total Products', value: stats.totalProducts.toString(), actionText: 'Manage Products', actionLink: '/admin/products' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <h2 className="text-lg font-bold mb-2">Error loading dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight text-left">Admin Dashboard</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-start justify-center min-h-[140px]"
          >
            <h3 className="text-gray-900 font-bold text-lg mb-1">{stat.title}</h3>
            <p className="text-3xl font-regular text-gray-700 tracking-tight mb-2">{stat.value}</p>
            {stat.actionText && (
              <a href={stat.actionLink} className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors">
                {stat.actionText}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Recent Orders</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f4f5f7]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                    ORDER ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                    USER
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                    TOTAL PRICE
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest text-left">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-5 font-bold text-gray-700 text-xs truncate max-w-[200px]">{order._id}</td>
                      <td className="px-6 py-5 text-gray-500">{order.user?.name || 'Guest'}</td>
                      <td className="px-6 py-5 text-gray-500">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                        `}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
