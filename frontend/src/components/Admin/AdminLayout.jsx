import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineArchiveBox,
  HiOutlineClipboardDocumentList,
  HiOutlineBuildingStorefront,
  HiArrowRightOnRectangle,
  HiBars3
} from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  { name: 'Admin Dashboard', path: '/admin', end: true, icon: HiOutlineSquares2X2 },
  { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
  { name: 'Products', path: '/admin/products', icon: HiOutlineArchiveBox },
  { name: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardDocumentList },
];

const SidebarContent = ({ setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand logo */}
      <div className="px-8 py-6 mb-4">
        <h1 className="text-2xl font-bold text-white tracking-wide">NexCart</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 opacity-75" />
            {item.name}
          </NavLink>
        ))}

        <div className="mt-8 pt-6 border-t border-gray-800 space-y-2">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <HiOutlineBuildingStorefront className="w-5 h-5 opacity-75" />
            Shop
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm border border-red-600"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: Fixed width, dark UI mimicking reference */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#111827] text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <SidebarContent setIsMobileMenuOpen={setIsMobileMenuOpen} />
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* Mobile Header Toggle */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">NexCart Admin</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Outlet for Nested Pages */}
        <div className="p-6 md:p-10 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
