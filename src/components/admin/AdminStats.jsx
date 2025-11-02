const AdminStats = ({ stats }) => {
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Products"
        value={stats.total_products}
        icon="📦"
        color="border-blue-500"
      />

      <StatCard
        title="Total Orders"
        value={stats.total_orders}
        icon="🛒"
        color="border-green-500"
        subtitle={`${stats.orders_by_status.pending} pending`}
      />

      <StatCard
        title="Total Revenue"
        value={`$${parseFloat(stats.total_revenue).toFixed(2)}`}
        icon="💰"
        color="border-yellow-500"
        subtitle="From delivered orders"
      />

      <StatCard
        title="Low Stock Alerts"
        value={stats.low_stock_count}
        icon="⚠️"
        color="border-red-500"
        subtitle={`${stats.out_of_stock_count} out of stock`}
      />
    </div>
  );
};

export default AdminStats;
