import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";

const normalizeSearchQuery = (value) => value.trim().replace(/\s+/g, " ");

export const HeaderSearchControl = ({
  buttonClassName = "",
  panelClassName = "",
  placeholder = "Search products...",
  mobileTopClassName = "top-16",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    inputRef.current?.focus();

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedQuery = normalizeSearchQuery(query);
    const params = new URLSearchParams(location.search);

    if (normalizedQuery) {
      params.set("search", normalizedQuery);
    } else {
      params.delete("search");
    }

    const nextSearch = params.toString();
    const supportedInlineSearchPath = location.pathname === "/" || location.pathname === "/shop";
    const targetPath = supportedInlineSearchPath ? location.pathname : "/shop";
    const targetUrl = nextSearch ? `${targetPath}?${nextSearch}` : targetPath;

    navigate(targetUrl);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${panelClassName}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={buttonClassName}
        aria-label="Search products"
      >
        <Icon className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Icon>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[65] bg-slate-900/20 backdrop-blur-[1px] sm:hidden" />
          <form
            onSubmit={handleSubmit}
            className={`fixed left-3 right-3 ${mobileTopClassName} z-[70] flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[min(24rem,calc(100vw-2rem))] sm:flex-row sm:items-center sm:gap-2 sm:rounded-2xl sm:p-3 ${panelClassName}`.trim()}
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 sm:min-w-0 sm:flex-1 sm:rounded-xl">
              <Icon className="h-5 w-5 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Icon>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 sm:flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 sm:flex-none"
              >
                Search
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};