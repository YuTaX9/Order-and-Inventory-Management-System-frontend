import { Link } from "react-router-dom";

const OrderCard = ({ order, onDelete }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  const statusColor = statusColors[order.status] || "bg-gray-100 text-gray-800";
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition">
           {" "}
      <div className="flex justify-between items-start mb-4">
               {" "}
        <div>
                   {" "}
          <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                   {" "}
          <p className="text-sm text-gray-600">
                       {" "}
            {new Date(order.order_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
                     {" "}
          </p>
                 {" "}
        </div>
               {" "}
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
        >
                   {" "}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}       {" "}
        </span>
             {" "}
      </div>
                 {" "}
      <div className="mb-4">
               {" "}
        <p className="text-sm text-gray-600">
                    {order.order_items?.length || 0} item(s)        {" "}
        </p>
               {" "}
        <p className="text-2xl font-bold text-blue-600 mt-1">
                    ${parseFloat(order.total_amount).toFixed(2)}       {" "}
        </p>
             {" "}
      </div>
           {" "}
      <div className="flex gap-3">
                 {" "}
        <Link
          to={`/orders/${order.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
                      View Details          {" "}
        </Link>
                 {" "}
        <button
          onClick={() => onDelete(order.id)}
          className="flex-1 text-center bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold"
        >
                      Delete          {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default OrderCard;
