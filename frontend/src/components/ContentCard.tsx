// src/components/ContentCard.tsx
import * as React from "react";
import { Youtube, Twitter as TwitterIcon, Newspaper, ExternalLink, Share2, Tag } from "lucide-react";
import { Tweet } from "react-tweet";

type Base = { title: string; url: string; tags?: string[]; className?: string; };
type YouTubeProps = Base & { type: "youtube"; src: string; channel?: string; };
type TwitterProps = Base & { type: "twitter"; tweetId: string; };
type MediumProps  = Base & { type: "medium"; cover?: string; excerpt?: string; author?: string; readingTime?: string; };
export type ContentCardProps = YouTubeProps | TwitterProps | MediumProps;

const getYouTubeId = (input: string): string => {

    if (input.length === 11 && !input.includes("http")) return input;
    const url = new URL(input);
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
    const v = url.searchParams.get("v"); if (v) return v;

  return input;
};

const sourceMeta = {
  youtube: { label: "YouTube", Icon: Youtube },
  twitter: { label: "Twitter", Icon: TwitterIcon },
  medium:  { label: "Medium",  Icon: Newspaper },
} as const;

export default function ContentCard(props: ContentCardProps) {
  const { className, title, url, tags } = props;
  const SrcIcon = sourceMeta[props.type].Icon;
  const srcLabel = sourceMeta[props.type].label;

  const onShare = async () => {
    try { if (navigator.share) { await navigator.share({ title, url }); return; } } catch {}
    try { await navigator.clipboard.writeText(url); alert("Link copied"); } catch { window.open(url, "_blank", "noopener,noreferrer"); }
  };

  return (
    <article
      className={[
        // removed max-w-xl so the card fills its column width
        "group relative w-full overflow-hidden rounded-2xl",
        "bg-black border border-[#1E1E1E] shadow-lg transition hover:shadow-xl",
        className ?? "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-2.5 py-1">
          <SrcIcon size={14} />
          <span className="text-xs text-gray-300">{srcLabel}</span>
        </div>
        <span className="mx-2 h-4 w-px bg-[#2A2A2A]" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-sm text-gray-400 hover:text-white" title={url}>
          {new URL(url).hostname.replace(/^www\./, "")}
        </a>
      </div>

      {/* Title */}
      <h3 className="px-4 pt-2 text-lg font-semibold leading-snug text-white">{title}</h3>

      {/* Body */}
      <div className="px-4 pt-3">
        {props.type === "youtube" && <YouTubeBody src={props.src} />}
        {props.type === "twitter" && <TwitterBody tweetId={props.tweetId} />}
        {props.type === "medium"  && <MediumBody cover={props.cover} excerpt={props.excerpt} author={props.author} readingTime={props.readingTime} />}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {(tags ?? []).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-md border border-[#2A2A2A] px-2 py-1 text-[11px] text-gray-300">
              <Tag size={12} />{t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onShare} className="inline-flex items-center gap-1 rounded-lg border border-[#F3E3B3] px-2.5 py-1.5 text-xs text-[#F3E3B3] hover:bg-[#f3e3b31a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40">
            <Share2 size={14} />Share
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#F3E3B3] px-2.5 py-1.5 text-xs text-black hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E3B3]/40">
            <ExternalLink size={14} />Open
          </a>
        </div>
      </div>
    </article>
  );
}

function YouTubeBody({ src }: { src: string }) {
  const id = getYouTubeId(src);
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
function TwitterBody({ tweetId }: { tweetId: string }) {
  return <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] p-3"><Tweet id={tweetId} /></div>;
}
function MediumBody({ cover, excerpt, author, readingTime }: { cover?: string; excerpt?: string; author?: string; readingTime?: string; }) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0E0E0E] overflow-hidden">
      <div className="relative aspect-video w-full bg-[#151515]">
        {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-to-br from-[#1b1b1b] to-[#0f0f0f]" />}
      </div>
      <div className="p-3">
        {excerpt && <p className="text-sm text-gray-300 line-clamp-3">{excerpt}</p>}
        <div className="mt-2 text-xs text-gray-500">
          {author ? <span>By {author}</span> : null}
          {author && readingTime ? <span className="mx-2">•</span> : null}
          {readingTime ? <span>{readingTime}</span> : null}
        </div>
      </div>
    </div>
  );
}
