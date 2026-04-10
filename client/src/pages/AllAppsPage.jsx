import { DiVisualstudio } from "react-icons/di";
import AppCard from "../ui/AppCard";

import { useEffect, useState } from "react";

const AllAppsPage = () => {
  const [apps, setApps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalApps, setTotalApps] = useState(0)
  // http://localhost:5000/apps?page=3&skip=10&limit=4
  useEffect(() => {
    fetch(`http://localhost:5000/apps?page=${currentPage}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setApps(data.apps)
        setTotalApps(data.totalApps)
        setTotalPages(Math.ceil(data.totalApps / 10))
      })
  }, [currentPage])


  const handleSort = (sortType) => {
    console.log(sortType);
  }
  return (
    <div>
      <title>All Apps | Hero Apps</title>
      {/* Header */}
      <div className="md:py-16 py-10">
        <h2 className="text-4xl font-bold text-center text-primary flex justify-center gap-3">
          Our All Applications
          <DiVisualstudio size={48} className="text-secondary"></DiVisualstudio>
        </h2>
        <p className="text-center text-gray-400">
          Explore All Apps on the Market developed by us. We code for Millions
        </p>
      </div>
      {/* Search and Count */}
      <div className="w-11/12 mx-auto flex flex-col-reverse lg:flex-row gap-5 items-start justify-between lg:items-end mt-10">
        <div>
          <h4 className="text-lg underline font-bold">
            Total Apps: ({totalApps})
          </h4>
          <h2 className="text-lg underline font-bold">
            ({apps.length}) Apps Found for Page - {currentPage}
          </h2>
        </div>

        <form>
          <label className="input max-w-[300px] w-[300px] input-secondary">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="" placeholder="Search Apps" />
          </label>
        </form>

        <div className="">
          <select onChange={(e) => handleSort(e.target.value)} defaultValue="" className="select bg-white">
            <option value="" disabled >
              Sort by: R / S / D
            </option>
            <option value={"rating-desc"}>Ratings : High - Low</option>
            <option value={"rating-asc"}>Ratings : Low - High</option>
            <option value={"size-desc"}>Size : High - Low</option>
            <option value={"size-asc"}>Size : Low - High</option>
            <option value={"downloads-desc"}>Downloads : High - Low</option>
            <option value={"downloads-asc"}>Downloads : Low - High</option>
          </select>
        </div>
      </div>
      {/* Loading State */}

      {/* Pagination Logic */}
      <div className="mt-5 flex flex-wrap gap-4 justify-center">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn"
          >
            Prev
          </button>
        )}
        {
          [...Array(totalPages).keys()].map(i => (
            <button
              onClick={() => setCurrentPage(i + 1)}
              className={`btn ${i + 1 === currentPage && "btn-primary"}`}
            >
              {i + 1}
            </button>
          ))
        }

        {
          currentPage < totalPages && <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn"
          >
            Next
          </button>
        }
      </div>

      {/* Pagination Logic */}

      <>
        {/* Apps Grid */}
        <div className="flex justify-end w-11/12 mx-auto">
        <p className=" mt-5 max-w-20 bg-accent rounded-md p-3 ">{currentPage} / {totalPages}</p>
        </div>
        <div className="w-11/12 mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 my-10 gap-5">
          {apps.length === 0 ? (
            <div className="col-span-full text-center py-10 space-y-10">
              <h2 className="text-6xl font-semibold opacity-60">
                No Apps Found
              </h2>
              <button className="btn btn-primary">Show All Apps</button>
            </div>
          ) : (
            apps.map((app) => <AppCard key={app.id} app={app}></AppCard>)
          )}
        </div>
      </>



    </div>
  );
};

export default AllAppsPage;
