import React, { useState } from "react";
import Crossicon from "./ui/Crossicon";
import { Share2 } from "lucide-react";

function CreateContentModal({ open, onClose  }) {
  return (
    <div>
      {open && (
        <div
        className="fixed inset-0 bg-black/50 opacity-100 z-[100] flex items-center justify-center"
          onClick={onClose}
       >
          <div className="flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
            <span className="block w-full max-w-md rounded-2xl bg-[#1b1b1b] text-white shadow-xl border border-white/10 p-5">
              <div className="flex justify-end">
                <button
                  aria-label="Close"
                  className="rounded-lg p-2 mb-1 hover:bg-white/10 active:scale-85 focus:outline-none "
                  onClick={onClose}
                >
                  <Crossicon/>
                </button>
              </div>

              <div className="mt-1 space-y-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Link"
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm rounded-lg border border-[#F3E3B3]/60 text-[#1b1b1b] bg-[#F3E3B3] px-3 py-2 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
              
               >
                 Submit
                </button>
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
export default CreateContentModal;
