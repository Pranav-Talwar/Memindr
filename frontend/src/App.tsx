// src/App.tsx (updated to use universal ContentCard)
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ContentCard from "./components/ContentCard";
import Masonry from "./components/Masonry";
import "./app.css";

type DemoItem = {
  title: string;
  link: string;
  type?: "youtube" | "twitter" | "article";
  collection?: { name: string; color?: string };
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Demo data shaped like your backend Content: { title, link, collection? }
  const demo: DemoItem[] = [
    {
      title: "Big Buck Bunny trailer",
      link: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      type: "youtube",
      collection: { name: "Videos", color: "#F3E3B3" },
    },
    {
      title: "OpenAI tweet (X)",
      link: "1954154258107895811",
      type: "twitter",
      collection: { name: "Social", color: "#A3E4D7" },
    },
    {
      title: "OpenAI tweet (URL)",
      link: "https://twitter.com/i/web/status/1628832338187636740",
      type: "twitter",
      collection: { name: "Social", color: "#A3E4D7" },
    },
    {
      title: "Office COLD OPENS",
      link: "https://www.youtube.com/watch?v=DQi4zSIhS4M",
      type: "youtube",
      collection: { name: "Comedy", color: "#AED6F1" },
    },
    {
      title: "Best of Saul",
      link: "BLS7Vyu17i8",
      type: "youtube",
      collection: { name: "TV", color: "#F5B7B1" },
    },
    {
      title: "Great REST API design article",
      link: "https://martinfowler.com/articles/richardsonMaturityModel.html",
      type: "article",
      collection: { name: "Backend", color: "#D7BDE2" },
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
              <ContentCard
                key={i}
                title={c.title}
                link={c.link}
                type={c.type}
                collection={c.collection}
              />
            ))}
          </Masonry>
        </main>
      </div>
    </div>
  );
}
