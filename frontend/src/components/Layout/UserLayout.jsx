import React from "react";
import Header from "../Common/Header.jsx";
import Topbar from "./Topbar.jsx";
import Navbar from "../Common/Navbar.jsx";
import Footer from "../Common/Footer.jsx";
import { Outlet } from "react-router-dom";
import ChatSidebar from "../Chat/ChatSidebar.jsx";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow bg-gray-100">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
      <ChatSidebar />
    </div>
  );
};

export default UserLayout