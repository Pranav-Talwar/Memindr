// components/Sidebar.tsx
import React from "react";
import { X, FolderOpen, Filter, Trash2, Plus } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const sectionList = ["Recipes", "Fitness", "Meditations", "Work", "Travel", "Hobbies"];
const collectionDotClasses = [
  "bg-[#F3E3B3]",
  "bg-[#A3E4D7]",
  "bg-[#F5B7B1]",
  "bg-[#AED6F1]",
  "bg-[#D7BDE2]",
  "bg-[#F9E79F]",
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      aria-label="Primary"
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#000] text-white
                  transform transition-transform duration-300
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}
                  lg:translate-x-0 lg:static lg:flex lg:flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <h1 id="app-title" className="text-4xl ml-2 italic text-[#F3E3B3]">Mindra</h1>
        <button
          type="button"
          className="lg:hidden text-gray-400 hover:text-white"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-2 overflow-y-auto" aria-labelledby="app-title">
        <div className="flex flex-col gap-1">
          <SidebarItem icon={<FolderOpen size={18} />} label="All" active />
          <SidebarItem icon={<Filter size={18} />} label="Unsorted" />
          <SidebarItem icon={<Trash2 size={18} />} label="Trash" />
        </div>

        <h2 className="mt-6 mb-2 text-[11px] uppercase text-gray-500 tracking-widest">
          Collections
        </h2>

        <ul className="flex flex-col">
          {sectionList.map((label, idx) => (
            <li key={label}>
              <SidebarItem
                icon={<span className={`inline-block h-2.5 w-2.5 rounded-full ${collectionDotClasses[idx % collectionDotClasses.length]}`} />}
                label={label}
                indent
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex items-center mt-6 text-sm text-[#F3E3B3] hover:underline"
          aria-label="Create new collection"
        >
          <Plus size={14} className="mr-1" />
          New collection
        </button>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1E1E1E] flex items-center gap-3">
        <img
          src="https://placehold.co/32x32/png"
          alt="Profile avatar"
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
    <button
      type="button"
      className={[
        "group relative flex w-full items-center gap-3 px-3 py-2 rounded-md",
        "hover:bg-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40",
        active ? "bg-[#1a1a1a]" : "",
        indent ? "pl-2 text-gray-400 hover:text-white" : "",
        // left indicator without layout shift
        "before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px]",
        active ? "before:bg-[#F3E3B3] before:opacity-100" : "before:opacity-0",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
