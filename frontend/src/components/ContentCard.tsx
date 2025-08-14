import * as React from "react";
import { Youtube, Twitter as TwitterIcon, ExternalLink, Share2, Globe } from "lucide-react";
import { Tweet } from "react-tweet";

type Source = "youtube" | "twitter" | "article";

type ContentCardProps = {
  title: string;
  link: string; // full URL or bare ID
  type?: Source; // optional override
  className?: string;
  collection?: { name: string; color?: string }; // display only
};

const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be"]);
const X_HOSTS  = new Set(["x.com", "twitter.com", "www.twitter.com", "www.x.com"]);

export default function ContentCard({ title, link, type, className, collection }: ContentCardProps) {
  const detected = React.useMemo(() => classify(link), [link]);
  const source = type ?? detected.source;
  const youtubeId = detected.youtubeId;
  const tweetId = detected.tweetId;
  const resolvedUrl = detected.resolvedUrl;
  const hostname = detected.hostname;

  const favicon = hostname ? `https://icons.duckduckgo.com/ip3/${hostname}.ico` : "";
  const srcMeta = {
    youtube: { label: "YouTube", Icon: Youtube },
    twitter: { label: "Twitter", Icon: TwitterIcon },
    article: { label: "Article", Icon: Globe },
  } as const;
  const { Icon, label } = srcMeta[source];

  const onShare = async () => {
    try { if (navigator.share) { await navigator.share({ title, url: resolvedUrl }); return; } } catch {}
    try { await navigator.clipboard.writeText(resolvedUrl); alert("Link copied"); } catch { window.open(resolvedUrl, "_blank", "noopener,noreferrer"); }
  };

  return (
    <article
      className={[
        "group relative w-full overflow-hidden rounded-2xl",
        "bg-black border border-[#1E1E1E] shadow-lg transition hover:shadow-xl",
        className ?? "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-2.5 py-1">
          <Icon size={14} />
          <span className="text-xs text-gray-300">{label}</span>
        </div>
        <span className="mx-2 h-4 w-px bg-[#2A2A2A]" />
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-gray-400 hover:text-white flex items-center gap-2"
          title={resolvedUrl}
        >
          {hostname ? (
            <img
              src={favicon}
              alt=""
              className="h-4 w-4 rounded-sm border border-[#2A2A2A] object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          <span>{hostname || resolvedUrl.replace(/^https?:\/\//, "")}</span>
        </a>
      </div>

      {/* Title */}
      <h3 className="px-4 pt-2 text-lg font-semibold leading-snug text-white">{title}</h3>

      {/* Body */}
      <div className="px-4 pt-3">
        {source === "youtube" && youtubeId ? <YouTubeBody id={youtubeId} /> : null}
        {source === "twitter" && tweetId ? <TwitterBody id={tweetId} /> : null}
        {source === "article" ? <ArticleBody url={resolvedUrl} /> : null}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {collection ? (
            <span className="inline-flex items-center gap-2 rounded-md border border-[#2A2A2A] px-2 py-1 text-[12px] text-gray-300">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: collection.color || "#ffffff" }}
              />
              <span className="truncate max-w-[180px]">{collection.name}</span>
            </span>
          ) : (
            <span className="text-[12px] text-gray-500">Unsorted</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1 rounded-lg border border-[#F3E3B3] px-2.5 py-1.5 text-xs text-[#F3E3B3] hover:bg-[#f3e3b31a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40"
          >
            <Share2 size={14} />
            Share
          </button>
          <a
            href={resolvedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[#F3E3B3] px-2.5 py-1.5 text-xs text-black hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40"
          >
            <ExternalLink size={14} />
            Open
          </a>
        </div>
      </div>
    </article>
  );
}

/* helpers */

function classify(input: string): {
  source: Source;
  youtubeId?: string;
  tweetId?: string;
  resolvedUrl: string;
  hostname?: string;
} {
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) {
    const resolvedUrl = `https://www.youtube.com/watch?v=${input}`;
    return { source: "youtube", youtubeId: input, resolvedUrl, hostname: "youtube.com" };
  }
  if (/^\d{10,25}$/.test(input)) {
    const resolvedUrl = `https://twitter.com/i/web/status/${input}`;
    return { source: "twitter", tweetId: input, resolvedUrl, hostname: "twitter.com" };
  }
  let u: URL | undefined;
  try { u = new URL(input); } catch {}
  if (!u) return { source: "article", resolvedUrl: input };
  const hostname = u.hostname.toLowerCase();
  if (YT_HOSTS.has(hostname)) {
    const id = extractYouTubeId(u);
    const resolvedUrl = `https://www.youtube.com/watch?v=${id}`;
    return { source: "youtube", youtubeId: id, resolvedUrl, hostname: "youtube.com" };
  }
  if (X_HOSTS.has(hostname)) {
    const id = extractTweetId(u);
    const resolvedUrl = `https://twitter.com/i/web/status/${id}`;
    return { source: "twitter", tweetId: id, resolvedUrl, hostname: "twitter.com" };
  }
  return { source: "article", resolvedUrl: u.toString(), hostname };
}

function extractYouTubeId(u: URL): string {
  if (u.hostname === "youtu.be") return u.pathname.slice(1).split("?")[0];
  const v = u.searchParams.get("v"); if (v) return v;
  if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || "";
  const segs = u.pathname.split("/").filter(Boolean);
  return segs[segs.length - 1] || "";
}
function extractTweetId(u: URL): string {
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.indexOf("status");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1].split("?")[0];
  for (let i = parts.length - 1; i >= 0; i--) if (/^\d{10,25}$/.test(parts[i])) return parts[i];
  return "";
}

/* bodies */

function YouTubeBody({ id }: { id: string }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl">
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0&showinfo=0`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        title="YouTube player"
      />
    </div>
  );
}
function TwitterBody({ id }: { id: string }) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-3">
      <Tweet id={id} />
    </div>
  );
}
function ArticleBody({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-4 text-sm text-gray-300">
      Saved link: <span className="break-all">{url}</span>
    </div>
  );
}

export type { ContentCardProps, Source };
