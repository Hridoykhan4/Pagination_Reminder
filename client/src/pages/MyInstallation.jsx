import { useEffect, useState } from "react";
import { GrInstall } from "react-icons/gr";
import InstallCard from "../ui/InstallCard";
import { toast } from "react-toastify";

const MyInstallation = () => {
  const [myApps, setMyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    // ✅ Read IDs from localStorage
    const storedIds = JSON.parse(localStorage.getItem("apps") || "[]");

    if (storedIds.length === 0) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/apps/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: storedIds }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch installed apps");
        return res.json();
      })
      .then(data => setMyApps(data.apps))
      .catch(err => {
        console.error(err);
        toast.error("Could not load your installed apps.");
      })
      .finally(() => setLoading(false));

  }, []);
  const handleSort = (value) => {
    if (!value) return;
    setSortOrder(value);
    setMyApps(prev =>
      [...prev].sort((a, b) =>
        value === "asc" ? a.size - b.size : b.size - a.size
      )
    );
  };

  const onUninstall = (id, title) => {
    // ✅ Update state
    setMyApps(prev => prev.filter(app => app._id !== id));

    // ✅ Sync localStorage
    const updatedIds = JSON.parse(localStorage.getItem("apps") || "[]")
      .filter(storedId => storedId !== id);
    localStorage.setItem("apps", JSON.stringify(updatedIds));

    toast(`🗑️ ${title} uninstalled from your device`);
  };

  return (
    <div className="px-5 lg:w-11/12 mx-auto py-10">
      <title>My Installations</title>

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-center text-primary flex justify-center gap-3">
          Your Installed Apps
          <GrInstall size={48} className="text-secondary" />
        </h2>
        <p className="text-center text-gray-400">
          Manage your installed applications
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between mt-10 items-center">
        <h2 className="text-lg underline text-secondary font-medium">
          {loading ? "Loading…" : `${myApps.length} apps installed`}
        </h2>
        <select
          value={sortOrder}
          onChange={e => handleSort(e.target.value)}
          className="select bg-white"
        >
          <option value="" disabled>Sort by size</option>
          <option value="asc">Size: low → high</option>
          <option value="desc">Size: high → low</option>
        </select>
      </div>

      <div className="divider" />

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl w-full" />
          ))}
        </div>
      )}

      {!loading && myApps.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-6xl mb-4">📭</p>
          <h3 className="text-2xl font-semibold">No apps installed yet</h3>
          <p className="text-gray-400 mt-2">Go explore the app store!</p>
        </div>
      )}

      {!loading && myApps.length > 0 && (
        <div className="grid grid-cols-1 gap-5">
          {myApps.map(app => (
            <InstallCard
              key={app._id}  
              app={app}
              onUninstall={onUninstall}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInstallation;