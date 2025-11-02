import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../services/adminService";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const statusColors = {
    pending: "text-yellow-500",
    processing: "text-blue-500",
    shipped: "text-purple-500",
    delivered: "text-green-500",
    cancelled: "text-red-500",
  };

  const statusBgColors = {
    pending: "bg-yellow-100",
    processing: "bg-blue-100",
    shipped: "bg-purple-100",
    delivered: "bg-green-100",
    cancelled: "bg-red-100",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-10 px-4 sm:px-6 lg:px-8">
           {" "}
      <div className="max-w-7xl mx-auto">
               {" "}
        <div className="text-center mb-12">
                   {" "}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Admin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Overview
            </span>
                     {" "}
          </h1>
                   {" "}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Dive into your store's performance at a glance. Manage
            products, orders, and inventory effortlessly.          {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                   {" "}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/80">
                       {" "}
            <div className="flex justify-between items-center mb-6">
                           {" "}
              <p className="text-sm font-medium text-gray-700">
                Total Products
              </p>
                           {" "}
              <div className="p-3 bg-blue-100 rounded-full">
                               {" "}
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <h3 className="text-5xl font-extrabold text-gray-900 mb-2">
              {stats.total_products}
            </h3>
                       {" "}
            <p className="text-sm text-gray-500">Currently active items</p>     
               {" "}
          </div>
                   {" "}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/80">
                       {" "}
            <div className="flex justify-between items-center mb-6">
                           {" "}
              <p className="text-sm font-medium text-gray-700">Total Orders</p> 
                         {" "}
              <div className="p-3 bg-green-100 rounded-full">
                               {" "}
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <h3 className="text-5xl font-extrabold text-gray-900 mb-2">
              {stats.total_orders}
            </h3>
                       {" "}
            <p className="text-sm text-yellow-600 font-semibold">
                            {stats.orders_by_status.pending || 0} pending orders
                         {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/80">
                       {" "}
            <div className="flex justify-between items-center mb-6">
                           {" "}
              <p className="text-sm font-medium text-gray-700">Total Revenue</p>
                           {" "}
              <div className="p-3 bg-purple-100 rounded-full">
                               {" "}
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                           {" "}
            </div>
                       {" "}
            <h3 className="text-5xl font-extrabold text-gray-900 mb-2">
                            $
              {parseFloat(stats.total_revenue).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
                         {" "}
            </h3>
                       {" "}
            <p className="text-sm text-gray-500">All-time delivered revenue</p> 
                   {" "}
          </div>
                   {" "}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/80">
                       {" "}
            <div className="flex justify-between items-center mb-6">
                           {" "}
              <p className="text-sm font-medium text-gray-700">Stock Alerts</p> 
                         {" "}
              <div className="p-3 bg-red-100 rounded-full">
                               {" "}
                <svg
                  className="w-7 h-7 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                                   {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                                 {" "}
                </svg>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <h3 className="text-5xl font-extrabold text-gray-900 mb-2">
              {stats.low_stock_count}
            </h3>
                       {" "}
            <p className="text-sm text-red-600 font-semibold">
                            {stats.out_of_stock_count} items out of stock      
                   {" "}
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Quick Actions</h2>
               {" "}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                   {" "}
          <Link
            to="/admin/products"
            className="relative p-6 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex flex-col items-center justify-center text-center"
          >
                       {" "}
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                       {" "}
            <svg
              className="w-12 h-12 mb-3 z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
                         {" "}
            </svg>
                       {" "}
            <h3 className="text-2xl font-bold mb-1 z-10">Products</h3>         
             {" "}
            <p className="text-white/90 text-sm z-10">Manage inventory items</p>
                     {" "}
          </Link>
                   {" "}
          <Link
            to="/admin/orders"
            className="relative p-6 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-green-500 to-emerald-600 text-white flex flex-col items-center justify-center text-center"
          >
                       {" "}
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                       {" "}
            <svg
              className="w-12 h-12 mb-3 z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
                         {" "}
            </svg>
                        <h3 className="text-2xl font-bold mb-1 z-10">Orders</h3>
                       {" "}
            <p className="text-white/90 text-sm z-10">
              View and track all orders
            </p>
                     {" "}
          </Link>
                   {" "}
          <Link
            to="/admin/inventory"
            className="relative p-6 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-purple-500 to-indigo-700 text-white flex flex-col items-center justify-center text-center"
          >
                       {" "}
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                       {" "}
            <svg
              className="w-12 h-12 mb-3 z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
                         {" "}
            </svg>
                       {" "}
            <h3 className="text-2xl font-bold mb-1 z-10">Inventory</h3>         
             {" "}
            <p className="text-white/90 text-sm z-10">
              Monitor stock levels & alerts
            </p>
                     {" "}
          </Link>
                   {" "}
          <Link
            to="/admin/categories"
            className="relative p-6 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 group bg-gradient-to-br from-orange-500 to-red-600 text-white flex flex-col items-center justify-center text-center"
          >
                       {" "}
            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                       {" "}
            <svg
              className="w-12 h-12 mb-3 z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
                         {" "}
            </svg>
                       {" "}
            <h3 className="text-2xl font-bold mb-1 z-10">Categories</h3>       
               {" "}
            <p className="text-white/90 text-sm z-10">
              Organize products into groups
            </p>
                     {" "}
          </Link>
                 {" "}
        </div>
               {" "}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12 border border-white/80">
                   {" "}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Orders by Status
          </h2>
                   {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                       {" "}
            {Object.entries(stats.orders_by_status).map(([status, count]) => (
              <div
                key={status}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition duration-200"
              >
                               {" "}
                <span
                  className={`text-4xl font-extrabold ${
                    statusColors[status] || "text-gray-800"
                  }`}
                >
                                    {count}               {" "}
                </span>
                               {" "}
                <span className="text-sm text-gray-600 mt-2 capitalize">
                  {status}
                </span>
                {stats.total_orders > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[
                      status
                    ]
                      .replace("text-", "bg-")
                      .replace("-500", "-100")} ${statusColors[status]}`}
                  >
                    {((count / stats.total_orders) * 100 || 0).toFixed(0)}%
                  </span>
                )}
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
               {" "}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/80">
                   {" "}
          <div className="flex justify-between items-center mb-6">
                       {" "}
            <h2 className="text-3xl font-bold text-gray-900">Recent Orders</h2> 
                     {" "}
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center transition duration-200"
            >
                            View All              {" "}
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
                             {" "}
              </svg>
                         {" "}
            </Link>
                     {" "}
          </div>
                   {" "}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
                       {" "}
            <table className="min-w-full divide-y divide-gray-200">
                           {" "}
              <thead className="bg-gray-100">
                               {" "}
                <tr>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order #
                  </th>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                                   {" "}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                                 {" "}
                </tr>
                             {" "}
              </thead>
                           {" "}
              <tbody className="bg-white divide-y divide-gray-200">
                               {" "}
                {stats.recent_orders.length > 0 ? (
                  stats.recent_orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.order_number}           
                                 {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {order.user_username}           
                                 {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                               {" "}
                        {new Date(order.order_date).toLocaleDateString()}       
                                     {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                $
                        {parseFloat(order.total_amount).toFixed(2)}             
                               {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap">
                                               {" "}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            statusBgColors[order.status]
                          } ${statusColors[order.status]} capitalize`}
                        >
                                                    {order.status}             
                                   {" "}
                        </span>
                                             {" "}
                      </td>
                                           {" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                               {" "}
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                        >
                                                    View Details                
                                 {" "}
                        </Link>
                                             {" "}
                      </td>
                                       {" "}
                    </tr>
                  ))
                ) : (
                  <tr>
                                       {" "}
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No recent orders to display.
                    </td>
                                     {" "}
                  </tr>
                )}
                             {" "}
              </tbody>
                         {" "}
            </table>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default AdminDashboard;
