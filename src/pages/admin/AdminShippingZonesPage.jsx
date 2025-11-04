import React, { useState, useEffect } from "react";
import {
  fetchShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from "../../services/shippingService";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import ConfirmModal from "../../components/common/ConfirmModal";

const initialZoneState = {
  name: "",
  country: "",
  base_rate: 0,
  free_shipping_threshold: "",
};

const AdminShippingZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentZone, setCurrentZone] = useState(initialZoneState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null);

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShippingZones();
      setZones(data);
    } catch (err) {
      setError("Failed to load shipping zones. Are you logged in as Admin?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentZone((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dataToSend = {
      ...currentZone,
      base_rate: parseFloat(currentZone.base_rate) || 0,
      free_shipping_threshold:
        currentZone.free_shipping_threshold === ""
          ? null
          : parseFloat(currentZone.free_shipping_threshold) || null,
    };

    try {
      if (isEditMode) {
        await updateShippingZone(currentZone.id, dataToSend);
      } else {
        await createShippingZone(dataToSend);
      }
      setCurrentZone(initialZoneState);
      setIsEditMode(false);
      loadZones();
    } catch (err) {
      setError(
        "Failed to save shipping zone. Check Admin permissions and data format."
      );
      console.error("Save error:", err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (zone) => {
    setCurrentZone({
      ...zone,
      base_rate: zone.base_rate.toString(),
      free_shipping_threshold: zone.free_shipping_threshold
        ? zone.free_shipping_threshold.toString()
        : "",
    });
    setIsEditMode(true);
  };

  const handleConfirmDelete = (zone) => {
    setZoneToDelete(zone);
  };

  const executeDelete = async () => {
    if (!zoneToDelete) return;
    setZoneToDelete(null);
    try {
      await deleteShippingZone(zoneToDelete.id);
      loadZones();
    } catch (err) {
      setError(
        "Failed to delete shipping zone. Ensure no orders are linked to it."
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        🌎 Manage Shipping Zones (Admin)
      </h1>

      {error && <ErrorMessage message={error} />}

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditMode
            ? `Edit Zone: ${currentZone.name}`
            : "Add New Shipping Zone"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={currentZone.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country/Region
              </label>
              <input
                type="text"
                name="country"
                value={currentZone.country}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Base Rate ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="base_rate"
                value={currentZone.base_rate}
                onChange={handleChange}
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Free Shipping Threshold ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="free_shipping_threshold"
                value={currentZone.free_shipping_threshold}
                onChange={handleChange}
                placeholder="Leave blank for no threshold"
                className="input"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Update Zone"
                : "Add Zone"}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setCurrentZone(initialZoneState);
                  setIsEditMode(false);
                }}
                className="btn btn-outline"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4">
        Existing Zones ({zones.length})
      </h2>
      <div className="overflow-x-auto card p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Free Shipping Threshold
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {zone.name} ({zone.country})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${parseFloat(zone.base_rate).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {zone.free_shipping_threshold ? (
                    <span className="badge badge-success">
                      ${parseFloat(zone.free_shipping_threshold).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(zone)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(zone)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!zoneToDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the shipping zone "${zoneToDelete?.name}"? This action cannot be undone.`}
        onConfirm={executeDelete}
        onCancel={() => setZoneToDelete(null)}
        confirmText="Yes, Delete"
        danger={true}
      />
    </div>
  );
};

export default AdminShippingZonesPage;
