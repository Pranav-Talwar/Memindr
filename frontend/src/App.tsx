import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import "./App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Transparent overlay: outside click closes sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#121212] text-white">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-6 lg:p-10 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-400">Your content goes here…</p>
        </main>
      </div>
    </div>
  );
}
