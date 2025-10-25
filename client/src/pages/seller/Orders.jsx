import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800",
    "Packing": "bg-yellow-100 text-yellow-800",
    "Shipped": "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    "Delivered": "bg-green-100 text-green-800"
  };

  const dateFilterOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Filtered orders using useMemo for performance
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search by order ID, customer name, or email
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(search) ||
        `${order.address.first_name} ${order.address.last_name}`.toLowerCase().includes(search) ||
        order.address.email.toLowerCase().includes(search) ||
        order.address.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by payment status
    if (paymentFilter) {
      if (paymentFilter === 'paid') {
        filtered = filtered.filter(order => order.isPaid || order.status === "Delivered");
      } else if (paymentFilter === 'pending') {
        filtered = filtered.filter(order => !order.isPaid && order.status !== "Delivered");
      }
    }

    // Filter by date
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);

        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate >= yesterday && orderDate < today;
          case 'last7days':
            const week = new Date(today);
            week.setDate(week.getDate() - 7);
            return orderDate >= week;
          case 'last30days':
            const month = new Date(today);
            month.setDate(month.getDate() - 30);
            return orderDate >= month;
          case 'custom':
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              end.setHours(23, 59, 59, 999); // Include the entire end date
              return orderDate >= start && orderDate <= end;
            }
            return true;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, startDate, endDate]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentFilter('');
    setDateFilter('');
    setStartDate('');
    setEndDate('');
  };

  const fetchOrders = async () => {
    try {
        setLoading(true);
        // console.log("🔍 Fetching orders..."); // ✅ Add
        
        const { data } = await axios.get("/api/order/seller");
        
        console.log("📦 Orders response:", data); // ✅ Add
        
        if (data.success) {
            console.log("✅ Orders count:", data.orders.length); // ✅ Add
            setOrders(data.orders);
        } else {
            console.log("❌ Error:", data.message); // ✅ Add
            toast.error(data.message);
        }
    } catch (error) {
        console.error("❌ Fetch error:", error); // ✅ Add
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

      const { data } = await axios.delete(`/api/order/${orderId}`);
      if (data.success) {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        toast.success("Order deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

      const { data } = await axios.put(`/api/order/status/${orderId}`, {
        status: newStatus
      });

      if (data.success) {
        // Update the order status in local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success('Order status updated successfully');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 h-[95vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50'>
      <div className="md:p-10 p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Total Orders: {orders.length}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Delivered: {orders.filter(order => order.status === 'Delivered').length}
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Filtered Results: {filteredOrders.length}
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Orders</h2>

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Email, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {dateFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchTerm || statusFilter || paymentFilter || dateFilter) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-600">×</button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('')} className="ml-1 hover:text-purple-600">×</button>
                  </span>
                )}
                {paymentFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Payment: {paymentFilter}
                    <button onClick={() => setPaymentFilter('')} className="ml-1 hover:text-green-600">×</button>
                  </span>
                )}
                {dateFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                    Date: {dateFilterOptions.find(opt => opt.value === dateFilter)?.label}
                    <button onClick={() => { setDateFilter(''); setStartDate(''); setEndDate(''); }} className="ml-1 hover:text-orange-600">×</button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <img src={assets.box_icon} alt="No orders" className="w-20 h-20 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {orders.length === 0 ? "No orders found" : "No orders match your filters"}
              </h3>
              <p className="text-gray-500">
                {orders.length === 0
                  ? "Orders will appear here when customers place them"
                  : "Try adjusting your search criteria or clearing filters"
                }
              </p>
              {orders.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <img src={assets.box_icon} alt="Order" className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {currency}{order.amount}
                      </span>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        disabled={updatingStatus[order._id]}
                        className="mr-4 sm:ml-4  px-3 py-1 bg-red-500 text-white  rounded-full text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">

                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={item.product?.image?.[0] || assets.box_icon}
                                alt={item.product?.name || 'Product'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.product?.name || 'Product Unavailable'}
                              </p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">
                              {currency}{((item.product?.offerPrice || 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">
                            {order.address.first_name} {order.address.last_name}
                          </p>
                          <p>
                            {order.address.email}
                          </p>
                          <p className="text-sm text-gray-600">{order.address.phone}</p>
                          <div className="text-sm text-gray-600">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state}</p>
                            <p>{order.address.zipcode}, {order.address.country}</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">Payment Details</h5>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between">
                            <span>Method:</span>
                            <span className="font-medium">{order.paymentType}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>Payment Status:</span>
                            <span
                              className={`font-medium ${order.isPaid || order.status === "Delivered"
                                ? "text-green-600"
                                : "text-orange-600"
                                }`}
                            >
                              {order.isPaid || order.status === "Delivered" ? "Paid" : "Pending"}
                            </span>
                          </p>

                          <p className="flex justify-between">
                            <span>Order Status:</span>
                            <span className={order.status === "Deliverd" ? "text-green-600" : "text-orange-600"}>{order.status === "Delivered" ? "Completed" : "Pending"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="lg:col-span-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Status
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          disabled={updatingStatus[order._id]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingStatus[order._id] && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            Updating status...
                          </div>
                        )}

                        {/* Status Progress */}
                        <div className="mt-4">
                          <div className="text-xs text-gray-500 mb-2">Progress</div>
                          <div className="flex items-center gap-1">
                            {statusOptions.map((status, index) => {
                              const currentIndex = statusOptions.indexOf(order.status);
                              const isCompleted = index <= currentIndex;
                              const isCurrent = index === currentIndex;

                              return (
                                <div
                                  key={status}
                                  className={`h-2 flex-1 rounded-full ${isCompleted
                                    ? isCurrent ? 'bg-primary' : 'bg-green-400'
                                    : 'bg-gray-200'
                                    }`}
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Started</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;