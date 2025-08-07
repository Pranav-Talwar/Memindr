import { Plus, Share2 } from 'lucide-react'

function MenuButtons() {
  return (
   <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center gap-4">
      {/* Add Button */}
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F3E3B3] text-black shadow-md hover:brightness-95 transition">
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* Share Button */}
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#F3E3B3] text-black shadow-md hover:brightness-95 transition">
        <Share2 size={26} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export default MenuButtons
