// components/Topbar.tsx
import React, { useState } from "react";
import { Menu, Search, Share2, Plus } from "lucide-react";
import CreateContentModal from "./CreateContentModal";
type TopbarProps = { onMenuClick: () => void ; onAddClick?: () => void };

const tags = ["All", "YouTube", "Twitter", "Medium"];
const defaultActive = "All";

export default function Topbar({ onMenuClick , onAddClick }: TopbarProps) {
  return (
    <div className="flex items-center justify-between px-4 lg:px-10 py-3.5 border-b border-[#1E1E1E] bg-[#121212]">
      {/* Left: menu + search */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-gray-400 hover:text-white lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <button type="button" className="text-gray-400 hover:text-white" aria-label="Search">
          <Search size={18} />
        </button>
      </div>

      {/* Center: tags */}
      <div role="tablist" aria-label="Filter by source" className="flex px-1 items-center gap-3 sm:gap-10 lg:gap-10">
        {tags.map((tag) => {
          const isActive = tag === defaultActive;
          return (
            <button
              key={tag}
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              className={[
                "relative text-sm text-gray-400 hover:text-white outline-none",
                "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-white",
                "hover:after:w-full data-[active=true]:after:w-full data-[active=true]:text-white transition-all",
                "focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40 rounded-sm",
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Right: Share + Add */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-6">
        <button
          type="button"
          className="flex items-center text-sm border border-[#F3E3B3] text-[#F3E3B3] px-3 py-1.5 rounded-lg hover:bg-[#f3e3b31a] transition"
        >
          <Share2 size={14} className="mr-1" />
          Share
        </button>

        <button
          type="button"
          aria-label="Add item"
          className="w-9 h-9 rounded-full bg-[#F3E3B3] text-black flex items-center justify-center hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40"
          onClick={() => onAddClick?.()}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
