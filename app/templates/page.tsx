"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import TemplatePreview from "@/components/TemplatePreview";
import TemplateChat from "@/components/TemplateChat";
import { Alert } from "@/components/ui/alert";
import { normalizeMultiPageData } from "@/lib/puck/multiPageUtils";
import { PRESET_TAG_GROUPS } from "@/lib/puck/templateTags";

type PublicTemplate = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
  puck_data: unknown;
  updated_at: string | null;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/templates")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setTemplates(json.data?.templates ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load templates");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => (t.tags || []).forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [templates]);

  const extraTags = useMemo(() => {
    const presetSet = new Set(PRESET_TAG_GROUPS.flatMap((g) => g.tags));
    return allTags.filter((t) => !presetSet.has(t));
  }, [allTags]);

  const filtered = useMemo(() => {
    if (!activeTag) return templates;
    return templates.filter((t) => (t.tags || []).includes(activeTag));
  }, [templates, activeTag]);

  return (
    <main className="min-h-screen bg-[#06070a] text-slate-200">
      <Navbar />
      <div className="pt-28">
        <section className="max-w-[1600px] mx-auto px-6 py-12">
          <div className="flex flex-col xl:flex-row gap-8 xl:items-stretch mb-12">
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl sm:text-5xl font-black tracking-[-0.04em] text-white leading-tight">
                  Website Templates
                </h1>
                <p className="text-slate-400 mt-2.5 max-w-xl text-sm sm:text-base font-normal leading-relaxed">
                  Production-ready multi-page website templates engineered for performance and conversion.
                </p>
              </div>

              {/* Tag Filter Bar — Quick Pills + Dropdown */}
              <div className="relative mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTag(null)}
                    className={`px-3 py-1.5 rounded-none text-xs font-mono font-bold transition-all border cursor-pointer uppercase tracking-wider ${
                      !activeTag
                        ? "bg-cyan-500 text-black border-cyan-400 font-extrabold"
                        : "text-slate-400 border-white/10 bg-white/[0.02] hover:text-white hover:border-white/20"
                    }`}
                  >
                    All
                  </button>

                  <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-none text-xs font-mono font-bold transition-all border cursor-pointer uppercase tracking-wider ${
                      activeTag
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        : "text-slate-300 border-white/10 bg-[#0d0e15] hover:text-white hover:border-white/25"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-none bg-cyan-400" />
                    Filter Tags
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeTag && (
                    <button
                      onClick={() => setActiveTag(null)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-mono font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      #{activeTag}
                      <X size={12} />
                    </button>
                  )}
                </div>

            {filterOpen && (
              <div className="absolute left-0 top-full mt-2 z-20 w-full max-w-3xl rounded-none border border-white/10 bg-[#0d0e15]/95 backdrop-blur-xl shadow-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    Filter by tag
                  </span>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {PRESET_TAG_GROUPS.map(({ group, tags }) => (
                  <div key={group}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setActiveTag((prev) => (prev === tag ? null : tag));
                            setFilterOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-none text-[11px] font-bold transition-all border cursor-pointer ${
                            activeTag === tag
                              ? "bg-cyan-500/20 text-white border-cyan-500/40"
                              : "text-slate-400 border-white/10 bg-white/[0.02] hover:text-white hover:border-white/25"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {extraTags.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                      More
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {extraTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setActiveTag((prev) => (prev === tag ? null : tag));
                            setFilterOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-none text-[11px] font-bold transition-all border cursor-pointer ${
                            activeTag === tag
                              ? "bg-cyan-500/20 text-white border-cyan-500/40"
                              : "text-slate-400 border-white/10 bg-white/[0.02] hover:text-white hover:border-white/25"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel on the right */}
        <div className="w-full xl:w-[400px] shrink-0 self-stretch">
          <TemplateChat
            availableTags={allTags}
            activeTag={activeTag}
            onSelectTag={setActiveTag}
          />
        </div>
      </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-none border border-white/10 bg-[#08090d] p-0 animate-pulse overflow-hidden"
                >
                  <div className="h-56 bg-white/5 border-b border-white/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/10 w-24 rounded-none" />
                    <div className="h-5 bg-white/10 w-3/4 rounded-none" />
                    <div className="h-3 bg-white/5 w-full rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert type="error" title="ERROR" message={error} className="rounded-none font-mono" />
          ) : filtered.length === 0 ? (
            <div className="p-12 rounded-none border border-white/10 bg-[#08090d] text-center space-y-4">
              <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                {activeTag
                  ? `No templates found matching tag "#${activeTag}"`
                  : "No published templates available"}
              </p>
              {activeTag && (
                <button
                  onClick={() => setActiveTag(null)}
                  className="px-4 py-2 bg-cyan-500 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-none hover:bg-cyan-400 transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  onClick={() => router.push(`/templates/${t.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      router.push(`/templates/${t.id}`);
                  }}
                  role="link"
                  tabIndex={0}
                  className="rounded-none overflow-hidden border border-white/10 bg-[#08090d] hover:border-cyan-500/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 overflow-hidden border-b border-white/10 pointer-events-none select-none bg-[#050608] relative">
                      <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out">
                        {t.thumbnail_url ? (
                          <img
                            src={t.thumbnail_url}
                            alt={t.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (() => {
                          const multi = normalizeMultiPageData(
                            t.puck_data as never,
                          );
                          const first = multi.pages[0];
                          if (!first?.data) {
                            return (
                              <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs font-bold uppercase tracking-widest">
                                NO_PREVIEW_AVAILABLE
                              </div>
                            );
                          }
                          return <TemplatePreview data={first.data} />;
                        })()}
                      </div>

                      {/* Category Badge Overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-none bg-black/80 backdrop-blur-md border border-white/15 text-cyan-300 text-[9px] font-mono font-bold uppercase tracking-widest shadow-lg">
                          {t.category || "Landing Page"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {t.name}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {t.description || "Production-ready multi-page website template."}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                    <div className="flex flex-wrap items-center gap-1.5 pt-3">
                      {(t.tags || []).slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTag(tag);
                          }}
                          className="px-2 py-0.5 rounded-none bg-white/[0.03] border border-white/10 text-slate-400 text-[9px] font-mono font-bold hover:text-cyan-300 hover:border-cyan-500/30 transition-colors uppercase tracking-wider"
                          title={`Filter by #${tag}`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                    <span className="pt-3 inline-flex items-center gap-1 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  </main>
);
}