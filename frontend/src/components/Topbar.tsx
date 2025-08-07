// components/Topbar.tsx
import React from "react";
import { Menu, Search, Share2, Plus } from "lucide-react";

type Props = { onMenuClick: () => void };

const tags = ["All", "YouTube", "Twitter", "Medium"];

export default function Topbar({ onMenuClick }: Props) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-10 py-3.5 border-b border-[#1E1E1E] bg-[#121212]">
      {/* LEFT GROUP: menu (mobile) + search */}
      <div className="flex items-center gap-4">
        <button
          className="text-gray-400 hover:text-white lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <button className="text-gray-400 hover:text-white">
          <Search size={18} />
        </button>
      </div>

      {/* CENTER GROUP: tags */}
      <div className="flex px-1 items-center gap-3 sm:gap-10  lg:gap-10">
        {tags.map((tag) => (
          <button
            key={tag}
            className="relative text-sm text-gray-400 hover:text-white
                       after:absolute after:-bottom-1 after:left-0
                       after:h-[2px] after:w-0 after:bg-white
                       hover:after:w-full transition-all"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* RIGHT GROUP: Share + Add */}
      <div className="flex items-center gap-3 sm-gap-6 lg:gap-6">
        <button className="flex items-center text-sm border border-[#F3E3B3]
                           text-[#F3E3B3] px-3 py-1.5 rounded-lg hover:bg-[#f3e3b310] transition">
          <Share2 size={14} className="mr-1" /> Share
        </button>

        <button className="w-9 h-9 rounded-full bg-[#F3E3B3]
                           text-black flex items-center justify-center hover:scale-105 transition">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
