import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import AdminStats from '../../components/admin/AdminStats';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <AdminStats stats={stats} />

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link 
          to="/admin/products"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center"
        >
          <div className="text-4xl mb-2">📦</div>
          <h3 className="text-xl font-semibold">Manage Products</h3>
          <p className="text-sm opacity-90 mt-1">Add, edit, or delete products</p>
        </Link>
        
        <Link 
          to="/admin/orders"
          className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition text-center"
        >
          <div className="text-4xl mb-2">📋</div>
          <h3 className="text-xl font-semibold">Manage Orders</h3>
          <p className="text-sm opacity-90 mt-1">View and update order status</p>
        </Link>
        
        <Link 
          to="/admin/inventory"
          className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center"
        >
          <div className="text-4xl mb-2">📊</div>
          <h3 className="text-xl font-semibold">Inventory</h3>
          <p className="text-sm opacity-90 mt-1">Monitor stock levels</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.orders_by_status).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`text-3xl font-bold ${statusColors[status]?.split(' ')[1] || 'text-gray-800'}`}>
                {count}
              </div>
              <div className="text-sm text-gray-600 mt-1 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-blue-600 hover:underline text-sm">
            View All →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Order #</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recent_orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{order.order_number}</td>
                  <td className="px-4 py-3 text-sm">{order.user_username}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link 
                      to={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;