// src/components/CreateContentModal.tsx
import React, { useRef, useState } from "react";
import axios from "axios";
import Crossicon from "./ui/Crossicon";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { backendUrl } from "../config";
type Props = {
  open: boolean;
  onClose: () => void;
  backendUrl?: string; // defaults to local dev
};

type Source = "youtube" | "twitter" | "article";
const TYPES: Source[] = ["youtube", "twitter", "article"];

export default function CreateContentModal({
  open,
  onClose,
  
}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<Source | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  async function addContent() {
    setErrorMsg("");

    const title = titleRef.current?.value?.trim() ?? "";
    const link = linkRef.current?.value?.trim() ?? "";
    const selected = type ?? undefined;

    if (!title || !link) {
      setErrorMsg("Title and link are required.");
      return;
    }

    // your /api/v1/content is protected by userMiddleware → need JWT
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Please sign in first.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${backendUrl}/api/v1/content`,
        { title, link, type: selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create content";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#1b1b1b] text-white shadow-xl border border-white/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
        >
          <Crossicon className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Create content</h2>

        <div className="space-y-3">
          <input
            ref={titleRef}
            type="text"
            placeholder="Title"
            autoComplete="off"
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400"
          />
          <input
            ref={linkRef}
            type="text"
            placeholder="Link"
            autoComplete="off"
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-white placeholder-white/50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-yellow-400"
          />

          {/* Type picker trigger */}
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-white ring-1 ring-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <span className="text-sm">
              {type ? `Type: ${type}` : "Choose type"}
            </span>
            {drawerOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>

          {/* Bottom drawer */}
          <div
            className={`fixed left-0 right-0 bottom-0 z-[1100] transition-transform duration-300 ${
              drawerOpen ? "translate-y-0" : "translate-y-full"
            }`}
            aria-hidden={!drawerOpen}
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="mx-auto w-full max-w-md rounded-t-2xl bg-[#1b1b1b] text-white shadow-2xl border border-white/10 p-4"
              role="dialog"
              aria-label="Select content type"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-sm text-white/70">Select type</div>
              <div className="grid grid-cols-3 gap-3">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setType(t);
                      setDrawerOpen(false);
                    }}
                    className={`rounded-lg px-3 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10 ${
                      type === t ? "bg-white/15" : "bg-white/5"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {errorMsg && <p className="text-sm text-red-400 mt-1">{errorMsg}</p>}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 hover:bg-white/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={addContent}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#F3E3B3] px-3 py-2 text-sm font-medium text-[#1b1b1b] hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
