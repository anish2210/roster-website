import { useState, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

export default function AddMultipleSitesModal({ onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const [sites, setSites] = useState([
    { id: 1, siteName: "", shortName: "", address: "", client: "", checked: false },
    { id: 2, siteName: "", shortName: "", address: "", client: "", checked: false },
    { id: 3, siteName: "", shortName: "", address: "", client: "", checked: false },
    { id: 4, siteName: "", shortName: "", address: "", client: "", checked: false },
    { id: 5, siteName: "", shortName: "", address: "", client: "", checked: false },
    { id: 6, siteName: "", shortName: "", address: "", client: "", checked: false },
  ]);

  const handleMouseDown = (e) => {
    if (e.target.closest(".modal-header")) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddMoreSites = () => {
    const newId = Math.max(...sites.map((s) => s.id)) + 1;
    setSites([
      ...sites,
      { id: newId, siteName: "", shortName: "", address: "", client: "", checked: false },
    ]);
  };

  const handleDeleteSite = (id) => {
    setSites(sites.filter((site) => site.id !== id));
  };

  const handleSiteChange = (id, field, value) => {
    setSites(
      sites.map((site) =>
        site.id === id ? { ...site, [field]: value } : site
      )
    );
  };

  const handleCheckboxChange = (id) => {
    setSites(
      sites.map((site) =>
        site.id === id ? { ...site, checked: !site.checked } : site
      )
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-6xl"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        {/* Header - Draggable */}
        <div
          className="modal-header flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-lg font-semibold text-gray-800">Add Sites</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-10 pb-3"></th>
                  <th className="text-left pb-3 px-2 text-sm font-medium text-gray-700">
                    Site Name
                  </th>
                  <th className="text-left pb-3 px-2 text-sm font-medium text-gray-700">
                    Short Name
                  </th>
                  <th className="text-left pb-3 px-2 text-sm font-medium text-gray-700">
                    Address
                  </th>
                  <th className="text-left pb-3 px-2 text-sm font-medium text-gray-700">
                    Client
                  </th>
                  <th className="w-10 pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, index) => (
                  <tr key={site.id} className="border-b border-gray-100">
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={site.checked}
                        onChange={() => handleCheckboxChange(site.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        placeholder="Site Name*"
                        value={site.siteName}
                        onChange={(e) =>
                          handleSiteChange(site.id, "siteName", e.target.value)
                        }
                        className={index === sites.length - 1 ? "border-blue-400" : ""}
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        placeholder="Short Name*"
                        value={site.shortName}
                        onChange={(e) =>
                          handleSiteChange(site.id, "shortName", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        placeholder="Address*"
                        value={site.address}
                        onChange={(e) =>
                          handleSiteChange(site.id, "address", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Select
                        value={site.client}
                        onChange={(e) =>
                          handleSiteChange(site.id, "client", e.target.value)
                        }
                      >
                        <option value="">Select...</option>
                        <option value="internal">Internal Company Site</option>
                        <option value="qld-rail">Queensland Rail</option>
                        <option value="private">Private Client</option>
                      </Select>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => handleDeleteSite(site.id)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add More Sites Button */}
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleAddMoreSites}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add More Sites
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
