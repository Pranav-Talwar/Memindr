// src/App.tsx (updated to use universal ContentCard)
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ContentCard from "./components/ContentCard";
import Masonry from "./components/Masonry";
import "./app.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Demo data shaped exactly like your backend Content: { title, link, tags? }
  const demo = [
    {
      title: "Big Buck Bunny trailer",
      link: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      tags: ["Animation", "Trailer"],
    },
    {
      title: "OpenAI tweet (X)",
      link: "1954154258107895811", // bare tweet ID works
      tags: ["AI", "Twitter"],
    },
    {
      title: "OpenAI tweet (URL)",
      link: "https://twitter.com/i/web/status/1628832338187636740",
      tags: ["AI", "Twitter"],
    },
    {
      title: "Office COLD OPENS",
      link: "https://www.youtube.com/watch?v=DQi4zSIhS4M",
      tags: ["Comedy"],
    },
    {
      title: "Best of Saul",
      link: "BLS7Vyu17i8", // bare YouTube ID works
      tags: ["TV"],
    },
    {
      title: "Great REST API design article",
      link: "https://martinfowler.com/articles/richardsonMaturityModel.html",
      tags: ["API", "Backend"],
    },
  ];

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
            {demo.map((c, i) => (
              <ContentCard key={i} title={c.title} link={c.link} />
            ))}
          </Masonry>
        </main>
      </div>
    </div>
  );
}
