import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currency, user, axios } = useAppContext();
    const navigate = useNavigate();

    const statusOptions = [
        "Order Placed",
        "Packing",
        "Shipped",
        "Out for Delivery",
        "Delivered"
    ];

    const statusColors = {
        "Order Placed": "bg-blue-100 text-blue-800 border-blue-200",
        "Packing": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
        "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
        "Delivered": "bg-green-100 text-green-800 border-green-200"
    };

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post("/api/order/user", { userId: user._id });

            if (data.success) {
                setMyOrders(data.orders);
            } else {
                console.error("Failed to fetch orders:", data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (myOrders.length === 0) {
        return (
            <div className='mt-16 pb-16 px-4'>
                <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                    <div className='text-center'>
                        <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 ml-22'>
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                        <button
                            onClick={() => {
                                navigate("/products");
                                window.scrollTo(0, 0);
                            }}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dull transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-16 pb-16 px-4'>
            {/* Header */}
            <div className='max-w-6xl mx-auto mb-8'>
                <div className='flex flex-col items-start w-max mb-4'>
                    <h1 className='text-3xl font-bold text-gray-900'>My Orders</h1>
                    <div className='w-20 h-1 bg-primary rounded-full mt-2'></div>
                </div>
                <p className='text-gray-600'>Track and manage your orders</p>
            </div>

            {/* Orders List */}
            <div className='max-w-6xl mx-auto space-y-6'>
                {myOrders.map((order) => (
                    <div key={order._id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'>
                        {/* Order Header */}
                        <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-gray-900'>Order #{order._id.slice(-8)}</h3>
                                        <p className='text-sm text-gray-500'>
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                        {order.status}
                                    </span>
                                    <div className='text-right'>
                                        <p className='text-sm text-gray-500'>Total Amount + Tax</p>
                                        <p className='text-xl font-bold text-gray-900'>{currency}{order.amount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className='p-6'>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                                {/* Items */}
                                <div>
                                    <h4 className='font-semibold text-gray-900 mb-4'>Items Ordered</h4>
                                    <div className='space-y-4'>
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className='flex items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                                            >
                                                {/* Image */}
                                                <div className='w-20 h-20 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0'>
                                                    <img
                                                        src={item.product.image[0] || '/placeholder-image.png'}
                                                        alt={item.product.name || 'Product Image'}
                                                        className='w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform'
                                                        onClick={() => {
                                                            window.scrollTo(0, 0);
                                                            navigate(`/products/${item.product.category.toLowerCase()}/${item.product._id}`);
                                                        }}
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className='flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-center'>
                                                    {/* Left side: Name, Category, Qty, Price */}
                                                    <div>
                                                        <h3 className='font-medium text-gray-900 mb-1 text-sm sm:text-base'>
                                                            {item.product.name}
                                                        </h3>
                                                        <p className='text-xs sm:text-sm text-gray-500 mb-1'>{item.product.category}</p>
                                                        <div className='flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600'>
                                                            <span>Qty: {item.quantity}</span>
                                                            <span>Price: {currency}{item.product.offerPrice}</span>
                                                        </div>
                                                    </div>

                                                    {/* Right side: Total */}
                                                    <div className='mt-2 sm:mt-0 sm:text-right'>
                                                        <p className='font-semibold text-gray-900'>
                                                            {currency}{(item.product.offerPrice * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                {/* Order Details & Status */}
                                <div>
                                    {/* Payment Info */}
                                    <div className='mb-6'>
                                        <h4 className='font-semibold text-gray-900 mb-3'>Payment Information</h4>
                                        <div className='bg-gray-50 rounded-lg p-4'>
                                            <div className='grid grid-cols-2 gap-4 text-sm'>
                                                <div>
                                                    <span className='text-gray-500'>Payment Method:</span>
                                                    <p className='font-medium text-gray-900'>{order.paymentType}</p>
                                                </div>
                                                <div>
                                                    <span className='text-gray-500'>Payment Status:</span>
                                                    <p className={`font-medium ${(order.paymentType === "Online" && order.isPaid) || (order.paymentType === "COD" && order.status === "Delivered") ? "text-green-600" : "text-orange-600"}`}>{order.paymentType === "Online" ? order.isPaid ? "Paid" : "Pending" : order.paymentType === "COD" ? order.status === "Delivered" ? "Paid" : "Pending" : order.isPaid ? "Paid" : "Pending"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Status Progress */}
                                    <div>
                                        <h4 className='font-semibold text-gray-900 mb-3'>Order Status</h4>
                                        <div className='bg-gray-50 rounded-lg p-4'>
                                            {/* Progress Bar */}
                                            <div className='mb-4 flex flex-col w-full'>
                                                {/* Status Circles */}
                                                <div className='flex justify-between w-full mb-2'>
                                                    {statusOptions.map((status, index) => {
                                                        const currentIndex = statusOptions.indexOf(order.status);
                                                        const isCompleted = index <= currentIndex;
                                                        const isCurrent = index === currentIndex;

                                                        return (
                                                            <div key={status} className='flex flex-col items-center flex-1'>
                                                                <div
                                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${isCompleted
                                                                        ? isCurrent ? 'bg-primary text-white' : 'bg-green-500 text-white'
                                                                        : 'bg-gray-300 text-gray-600'
                                                                        }`}
                                                                >
                                                                    {(isCompleted && !isCurrent) ||
                                                                        (index === statusOptions.length - 1 && order.status === 'Delivered') ? (
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        index + 1
                                                                    )}

                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Connecting Lines */}
                                                <div className='flex items-center gap-1 w-full'>
                                                    {statusOptions.map((_, index) => {
                                                        if (index === statusOptions.length - 1) return null;
                                                        const currentIndex = statusOptions.indexOf(order.status);
                                                        const isCompleted = index < currentIndex;

                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`h-1 flex-1 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Status Labels */}
                                            <div className='flex flex-wrap justify-between text-xs text-gray-500 mt-2'>
                                                {statusOptions.map((status, index) => (
                                                    <span
                                                        key={status}
                                                        className={`text-center flex-1 ${statusOptions.indexOf(order.status) === index ? 'font-medium text-primary' : ''}`}
                                                    >
                                                        {status}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Current Status */}
                                            <div className='text-center mt-4 pt-4 border-t border-gray-200'>
                                                <p className='text-sm text-gray-600'>Current Status</p>
                                                <p className={`font-semibold text-lg ${order.status === 'Delivered' ? 'text-green-600' : 'text-primary'}`}>
                                                    {order.status}
                                                </p>
                                                {order.status === 'Delivered' && (
                                                    <p className='text-sm text-green-600 mt-1'>
                                                        Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;