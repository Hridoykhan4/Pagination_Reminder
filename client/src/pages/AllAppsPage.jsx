import { DiVisualstudio } from "react-icons/di";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import AppCard from "../ui/AppCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const LIMIT = 12;

const AllAppsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "size";
  const order = searchParams.get("order") || "desc";
  const searchText = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [apps, setApps] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(searchText);

  const updateParams = (updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v) next.set(k, v); else next.delete(k);
      });
      return next;
    });
  };

  useEffect(() => {
    const controller = new AbortController(); 
    setLoading(true);

    const url = new URL("http://localhost:5000/apps");
    url.searchParams.set("page", currentPage);
    url.searchParams.set("limit", LIMIT);
    url.searchParams.set("sort", sort);
    url.searchParams.set("order", order);
    if (searchText) url.searchParams.set("search", searchText);
    if (category) url.searchParams.set("category", category);

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error("Fetch failed"); return r.json(); })
      .then(data => {
        setApps(data.apps);
        setPagination(data.pagination);
      })
      .catch(err => { if (err.name !== "AbortError") console.error(err); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentPage, sort, order, searchText, category]);

  const handleSort = (value) => {
    const [s, o] = value.split("-");
    updateParams({ sort: s, order: o, page: null });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ search: inputValue, page: null });
  };


  const clearSearch = () => {
    setInputValue("");
    updateParams({ search: null, category: null, page: null });
  };


  return (
    <div className="min-h-screen bg-base-200">
      <title>All Apps | Hero Apps</title>

      {/* Hero */}
      <div className="py-16 text-center px-4">
        <div className="badge badge-outline badge-primary mb-4 gap-2 py-3 px-4">
          <DiVisualstudio size={14} />
          App Marketplace
        </div>
        <h1 className="text-5xl font-bold text-base-content mb-3">
          All <span className="text-primary">Applications</span>
        </h1>
        <p className="text-base-content/60 max-w-md mx-auto">
          Explore our full catalog — built by us, trusted by millions.
        </p>
      </div>

      {/* Toolbar */}
      <div className="w-11/12 mx-auto flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">

        {/* Search */}
        <form onSubmit={handleSearch} className="join">
          <label className="input input-bordered join-item flex items-center gap-2 w-72">
            <svg className="w-4 h-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="searchVal"
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Search apps…"
              className="grow"
            />
            {inputValue && (
              <button type="button" onClick={clearSearch} className="opacity-50 hover:opacity-100">✕</button>
            )}
          </label>
          <button type="submit" className="btn btn-primary join-item">Search</button>
        </form>



        {/* Sort */}
        <select
          onChange={e => handleSort(e.target.value)}
          value={`${sort}-${order}`}
          className="select select-bordered select-sm"
        >
          <option value="rating-desc">Rating: high → low</option>
          <option value="rating-asc">Rating: low → high</option>
          <option value="size-desc">Size: high → low</option>
          <option value="size-asc">Size: low → high</option>
          <option value="downloads-desc">Downloads: high → low</option>
          <option value="downloads-asc">Downloads: low → high</option>
        </select>
      </div>

      {/* Meta bar */}
      <div className="w-11/12 mx-auto flex justify-between items-center mb-6 text-sm text-base-content/60">
        <div className="flex gap-4">
          <span><strong className="text-base-content">{pagination.total}</strong> apps</span>
          {searchText && (
            <span>Results for "<strong className="text-base-content">{searchText}</strong>"</span>
          )}
        </div>
        <span>Page {currentPage} / {pagination.totalPages || 1}</span>
      </div>

      {/* Grid */}
      <div className="w-11/12 mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(LIMIT)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${currentPage}-${sort}-${order}-${searchText}-${category}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .2 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {apps.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-6xl mb-4 opacity-30">🔍</p>
                  <h2 className="text-2xl font-semibold opacity-50 mb-4">No apps found</h2>
                  <button onClick={clearSearch} className="btn btn-primary btn-outline">
                    Clear filters
                  </button>
                </div>
              ) : (
                apps.map(app => <AppCard key={app._id} app={app} />)
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-6 flex-wrap">
          <button
            onClick={() => updateParams({ page: currentPage - 1 })}
            disabled={!pagination.hasPrevPage}
            className="btn btn-sm btn-outline"
          >← Prev</button>

          {[...Array(pagination.totalPages).keys()].map(i => {
            const p = i + 1;
            if (p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1) {
              return (
                <button
                  key={p}
                  onClick={() => updateParams({ page: p })}
                  className={`btn btn-sm ${p === currentPage ? "btn-primary" : "btn-outline"}`}
                >{p}</button>
              );
            }
            if (Math.abs(p - currentPage) === 2) return <span key={p} className="opacity-40">…</span>;
            return null;
          })}

          <button
            onClick={() => updateParams({ page: currentPage + 1 })}
            disabled={!pagination.hasNextPage}
            className="btn btn-sm btn-outline"
          >Next →</button>
        </div>
      )}
    </div>
  );
};

export default AllAppsPage;