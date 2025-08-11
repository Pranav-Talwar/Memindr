// src/App.tsx
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ContentCard from "./components/ContentCard"; // <-- fix path
import Masonry from "./components/Masonry";
import "./app.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 lg:hidden cursor-default"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col bg-[#121212] text-white">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-6 lg:p-10 overflow-y-auto">
          <Masonry>
            <ContentCard
              type="youtube"
              title="Big Buck Bunny trailer"
              src="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
              url="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
              tags={["Animation", "Trailer"]}
            />
                   <ContentCard
              type="twitter"
              title="OpenAI tweet"
              tweetId="1954154258107895811"
              url="https://x.com/mannupaaji/status/1954154258107895811"
              tags={["AI", "Twitter"]}
            />
            <ContentCard
              type="twitter"
              title="OpenAI tweet"
              tweetId="1628832338187636740"
              url="https://twitter.com/i/web/status/1628832338187636740"
              tags={["AI", "Twitter"]}
            />
          
             <ContentCard
              type="youtube"
              title="Office COLD OPENS "
              src="https://www.youtube.com/watch?v=DQi4zSIhS4M"
              url="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
              tags={["Animation", "Trailer"]}
            />
      
                    <ContentCard
              type="youtube"
              title="Best of saul"
              src="https://www.youtube.com/watch?v=BLS7Vyu17i8"
              url="https://www.youtube.com/watch?v=BLS7Vyu17i8"
              tags={["Animation", "Trailer"]}
            />
                <ContentCard
              type="youtube"
              title="Office COLD OPENS "
              src="https://www.youtube.com/watch?v=DQi4zSIhS4M"
              url="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
              tags={["Animation", "Trailer"]}
            />
            
            {/* add more cards */}
          </Masonry>
        </main>
      </div>
    </div>
  );
}
