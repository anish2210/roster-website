import { ArrowUpDown } from "lucide-react";
import { useMemo } from "react";
import sites from "../../data/sites";
import SiteRow from "./SiteRow";

export default function SitesTable({ showInactive }) {
  // Filter sites based on inactive toggle
  const filteredSites = useMemo(() => {
    if (showInactive) {
      return sites; // Show all sites
    }
    return sites.filter((site) => site.status !== "Inactive"); // Show only active sites
  }, [showInactive]);

  const totalSites = sites.length;
  const displayedSites = filteredSites.length;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
      {/* Scrollable table container */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-sm min-w-[1000px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-gray-600 text-xs">
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-10 sm:w-12 sticky left-0 bg-gray-50 z-[5]">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  Site/Location Name
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left whitespace-nowrap">Short Name</th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Client</th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">State</th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left">Status</th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-center whitespace-nowrap">
                Expiry in
                <br />
                30 Days
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-center w-16"></th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-right w-20 sm:w-24 sticky right-0 bg-gray-50 z-[5]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredSites.map((site) => (
              <SiteRow key={site.id} site={site} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-gray-600">
          Showing 1 to {displayedSites} of {displayedSites} entries
          {displayedSites !== totalSites && ` (filtered from ${totalSites} total entries)`}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Previous
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-600 text-white rounded">
            1
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Scroll indicator for mobile */}
      <div className="md:hidden px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">Scroll horizontally to view all columns</p>
      </div>
    </div>
  );
}
