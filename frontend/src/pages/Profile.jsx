import React, { useState } from 'react';
import { useOrder } from '../context/OrderContext';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineMapPin, HiOutlineArrowRightOnRectangle ,HiOutlineCog
} from 'react-icons/hi2';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import { useEffect } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!user) {
        navigate("/login");
    } else {
        dispatch(fetchUserOrders());
    }
  }, [dispatch, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: HiOutlineUser },
    { id: 'orders', name: 'My Orders', icon: HiOutlineShoppingBag },
    { id: 'addresses', name: 'Saved Addresses', icon: HiOutlineMapPin },
    { id:'settings', name:'Settings', icon:HiOutlineCog}
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl w-full flex-grow min-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 xl:w-1/5 bg-gray-900 text-white p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Logo replacing Rabbit */}
            <div className="flex items-center space-x-2 mb-12">
              <span className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                NexCart
              </span>
            </div>

            <div className="mb-10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold shadow-lg mb-6 uppercase">
                 {user?.name?.charAt(0) || "U"}
              </div>
              <h2 className="text-2xl font-semibold capitalize">{user?.name}</h2>
              <p className="text-gray-400 text-base mt-1">{user?.email}</p>
            </div>

            <nav className="space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-600/20 text-blue-400 shadow-md transform scale-105'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="font-semibold text-lg">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 px-5 py-4 text-gray-400 hover:text-red-400 transition-colors duration-300 mt-12 md:mt-0"
          >
            <HiOutlineArrowRightOnRectangle className="h-7 w-7" />
            <span className="font-semibold text-lg">Sign Out</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-3/4 xl:w-4/5 p-10 lg:p-16 bg-gray-50/50">
          
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(" ")[0]}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name?.split(" ")[1] || ""}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">Email address cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="px-6 py-4">Shipping Address</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                             Fetching your order history...
                          </td>
                        </tr>
                      ) : orders && orders.length > 0 ? (
                        orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <img 
                                src={order.orderItems && order.orderItems.length > 0 ? order.orderItems[0].image : "https://via.placeholder.com/150"} 
                                alt="Order items" 
                                className="w-14 h-14 rounded-lg object-cover shadow-sm" 
                              />
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">
                                {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{order.orderItems ? order.orderItems.length : 0}</td>
                            <td className="px-6 py-4 font-bold text-gray-800">${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${
                                order.isPaid 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                            You have no recent orders.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Addresses</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add New Address Card */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 transition-all cursor-pointer min-h-[200px]">
                  <span className="text-4xl mb-2">+</span>
                  <span className="font-medium">Add New Address</span>
                </div>

                {/* Example Address Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-blue-500">Edit</button>
                    <button className="text-gray-400 hover:text-red-500">Delete</button>
                  </div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">Default</span>
                  <h3 className="font-bold text-gray-800 mb-1">John Doe</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    123 E-commerce Avenue<br/>
                    Suite 400<br/>
                    New York, NY 10001<br/>
                    United States
                  </p>
                  <p className="text-gray-500 text-sm">+1 (555) 000-0000</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <p className="text-gray-600 text-sm">Manage your notification preferences.</p>
                  </div>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Manage</button>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                    <p className="text-gray-600 text-sm">Change your password or enable two-factor authentication.</p>
                  </div>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Manage</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Privacy</h3>
                    <p className="text-gray-600 text-sm">Control your privacy settings.</p>
                  </div>
                  <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Manage</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
