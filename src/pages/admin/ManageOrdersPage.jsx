import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import { SuccessMessage } from "../../components/common/SuccessMessage";

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);
  const loadOrders = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const data = await getAllOrders(statusFilter);
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setError("");
    setSuccessMessage("");

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccessMessage(
        `Order #${
          orders.find((o) => o.id === orderId)?.order_number
        } status updated to ${newStatus}.`
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update order status");
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    shipped: "bg-purple-100 text-purple-800 border-purple-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };
  if (loading) return <Loading />;
  return (
    <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>     {" "}
      {error && <ErrorMessage message={error} />}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
           {" "}
      <div className="mb-6 flex gap-4 items-center">
                <label className="font-medium">Filter by Status:</label>       {" "}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
                    <option value="">All Orders</option>         {" "}
          <option value="pending">Pending</option>         {" "}
          <option value="processing">Processing</option>         {" "}
          <option value="shipped">Shipped</option>         {" "}
          <option value="delivered">Delivered</option>         {" "}
          <option value="cancelled">Cancelled</option>       {" "}
        </select>
               {" "}
        <span className="text-gray-600">
                    ({orders.length} order{orders.length !== 1 ? "s" : ""})    
             {" "}
        </span>
             {" "}
      </div>
           {" "}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
               {" "}
        <table className="w-full">
                   {" "}
          <thead className="bg-gray-50">
                       {" "}
            <tr>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Order #
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Customer
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Date
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Items
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Total
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Update Status
              </th>
                           {" "}
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Actions
              </th>
                         {" "}
            </tr>
                     {" "}
          </thead>
                   {" "}
          <tbody className="divide-y">
                       {" "}
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                               {" "}
                <td className="px-4 py-3 text-sm font-medium">
                                    {order.order_number}               {" "}
                </td>
                               {" "}
                <td className="px-4 py-3 text-sm">
                                    {order.user_username}               {" "}
                </td>
                               {" "}
                <td className="px-4 py-3 text-sm text-gray-600">
                                   {" "}
                  {new Date(order.order_date).toLocaleDateString()}             
                   {" "}
                </td>
                               {" "}
                <td className="px-4 py-3 text-sm">
                                    {order.order_items?.length || 0}           
                     {" "}
                </td>
                               {" "}
                <td className="px-4 py-3 text-sm font-semibold">
                                    ${parseFloat(order.total_amount).toFixed(2)}
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-3">
                                   {" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      statusColors[order.status]
                    }`}
                  >
                                        {order.status}                 {" "}
                  </span>
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-3">
                                   {" "}
                  {order.status !== "delivered" &&
                  order.status !== "cancelled" ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      disabled={updatingOrderId === order.id}
                      className="p-2 border rounded text-sm"
                    >
                                           {" "}
                      <option value="pending">Pending</option>                 
                          <option value="processing">Processing</option>       
                                    <option value="shipped">Shipped</option>   
                                       {" "}
                      <option value="delivered">Delivered</option>             
                           {" "}
                    </select>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                                 {" "}
                </td>
                               {" "}
                <td className="px-4 py-3 text-sm">
                                   {" "}
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                                        View Details                  {" "}
                  </Link>
                                 {" "}
                </td>
                             {" "}
              </tr>
            ))}
                     {" "}
          </tbody>
                 {" "}
        </table>
                       {" "}
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
                        No orders found          {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default ManageOrdersPage;
