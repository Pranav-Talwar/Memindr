
// components/Sidebar.tsx
import React from "react";
import {
  X,
  FolderOpen,
  Filter,
  Trash2,
  Plus,
  Dot,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const collections = [
  "Recipes",
  "Fitness",
  "Meditations",
  "Work",
  "Travel",
  "Hobbies",
];

export default function Sidebar({ isOpen, onClose }: Props) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#000] text-white
                  transform transition-transform duration-200
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}
                  lg:translate-x-0 lg:static lg:flex lg:flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-4xl ml-2 italic text-[#F3E3B3]">Myndra</h1>
        <button
        ></button>
        <button 
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-2 overflow-y-auto">
        {/* Only these three items have extra gap */}
        <div className="flex flex-col gap-1">
          <SidebarItem icon={<FolderOpen size={18} />} label="All" active />
          <SidebarItem icon={<Filter size={18} />} label="Unsorted" />
          <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        </div>

        {/* Collections with default spacing */}
        <h2 className="mt-6 mb-2 text-[11px] uppercase text-gray-500 tracking-widest">
          Collections
        </h2>
        <div className="flex flex-col gap-1">
          {collections.map((col) => (
            <SidebarItem key={col} icon={<Dot size={12} />} label={col} indent />
          ))}
        </div>

        <button className="flex items-center mt-6 text-sm text-[#F3E3B3] hover:underline">
          <Plus size={14} className="mr-1" /> New collection
        </button>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1E1E1E] flex items-center gap-3">
        <img
          src="https://via.placeholder.com/32"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="text-sm">Christina Aborn</div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  indent = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
                  hover:bg-[#1a1a1a]
                  ${active ? "border-l-2 border-[#F3E3B3] bg-[#1a1a1a]" : ""}
                  ${indent ? "pl-6 text-gray-400 hover:text-white" : ""}`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}
