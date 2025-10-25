import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const {
        products,
        cartItems,
        setcartItems,
        removeitemfromcart,
        getcartcount,
        updateCart,
        navigate,
        getcartamount,
        axios,
        user,
        currency,
    } = useAppContext();

    const [cartArray, setcartArray] = useState([]);
    const [address, setAddress] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOptions, setPaymentOptions] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Setting cart for items - Fixed to prevent mutation of original products
    const getCart = () => {
        const tempArray = [];
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const product = products.find((item) => item._id === key);
                if (product) {
                    // Create a copy to avoid mutating original product
                    const productCopy = { ...product };
                    productCopy.quantity = cartItems[key];
                    tempArray.push(productCopy);
                }
            }
        }
        setcartArray(tempArray);
    };

    // Fetch user's addresses
    const getUserAddress = async () => {
        try {
            if (!user || !user._id) {
                return; // Don't show error if user not logged in, just return
            }

            const { data } = await axios.get(`/api/address/get?userId=${user._id}`);
            if (data.success && data.addresses) {
                setAddress(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                setAddress([]);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setAddress([]);
        }
    };

    // Razorpay payment handler - Fixed with better error handling
    const initiateRazorpayPayment = async () => {
        // try {
        //     setIsProcessing(true);

        //     // Check if Razorpay is loaded
        //     if (!window.Razorpay) {
        //         toast.error('Razorpay SDK not loaded. Please refresh and try again.');
        //         setIsProcessing(false);
        //         return;
        //     }

        //     // Step 1: Create order on backend
        //     const { data } = await axios.post("/api/order/online_payment/razor_pay", {
        //         userId: user._id,
        //         items: cartArray.map((item) => ({
        //             product: item._id,
        //             quantity: item.quantity,
        //         })),
        //         address: selectedAddress._id,
        //     });

        //     if (data.success) {
        //         // Step 2: Configure Razorpay options
        //         const options = {
        //             key: data.key || process.env.REACT_APP_RAZORPAY_KEY,
        //             amount: data.amount * 100, // Amount in paise
        //             currency: "INR",
        //             name: "Your Store Name",
        //             description: "Order Payment",
        //             order_id: data.razorpayOrderId,
        //             handler: async function (response) {
        //                 // Step 3: Payment successful - verify on backend
        //                 try {
        //                     const verifyResponse = await axios.post('/api/order/verify-payment', {
        //                         razorpay_order_id: response.razorpay_order_id,
        //                         razorpay_payment_id: response.razorpay_payment_id,
        //                         razorpay_signature: response.razorpay_signature,
        //                         orderId: data.orderId
        //                     });

        //                     if (verifyResponse.data.success) {
        //                         toast.success('Payment successful!');
        //                         setcartItems({}); // Clear cart
        //                         navigate('/my-orders');
        //                     } else {
        //                         toast.error('Payment verification failed');
        //                     }
        //                 } catch (error) {
        //                     console.error('Verification error:', error);
        //                     toast.error('Payment verification failed');
        //                 } finally {
        //                     setIsProcessing(false);
        //                 }
        //             },
        //             modal: {
        //                 ondismiss: function () {
        //                     console.log('Payment modal dismissed');
        //                     setIsProcessing(false);
        //                 }
        //             },
        //             theme: {
        //                 color: "#3399cc"
        //             },
        //             prefill: {
        //                 name: user.name || "",
        //                 email: user.email || "",
        //                 contact: user.phone || ""
        //             }
        //         };

        //         // Step 4: Open Razorpay checkout with timeout
        //         setTimeout(() => {
        //             const rzp = new window.Razorpay(options);
        //             rzp.open();
        //         }, 100);

        //     } else {
        //         toast.error(data.message || 'Failed to create payment order');
        //         setIsProcessing(false);
        //     }
        // } catch (error) {
        //     console.error('Payment error:', error);
        //     toast.error(error.response?.data?.message || 'Payment initiation failed');
        //     setIsProcessing(false);
        // }
        alert("Access is Denied by the Developer")
    };

    // Place order - Fixed with login check
    const placeOrder = async () => {
        try {
            // Check if user is logged in first
            if (!user || !user._id) {
                toast.error("Please login to continue");
                // navigate('/login');
                return;
            }

            if (cartArray.length === 0) {
                toast.error("Your cart is empty");
                return;
            }

            if (!selectedAddress) {
                toast.error("Please add a delivery address");
                return;
            }

            if(paymentOptions === ""){
                toast.error("Select a Payment Option");
                return;
            }
            else if (paymentOptions === "COD") {
                setIsProcessing(true);
                const { data } = await axios.post("/api/order/cod", {
                    userId: user._id,
                    items: cartArray.map((item) => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    address: selectedAddress._id,
                });

                if (data.success) {
                    toast.success(data.message || "Order placed successfully!");
                    setcartItems({});
                    navigate("/my-orders");
                } else {
                    toast.error(data.message || "Failed to place order");
                }
            } else if (paymentOptions === "Online") {
                // Call Razorpay payment function
                await initiateRazorpayPayment();
                return; // Don't set isProcessing to false here as it's handled in the payment function
            } 
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to place order');
        } finally {
            if (paymentOptions === "COD") {
                setIsProcessing(false);
            }
        }
    };

    // Calculate tax amount
    const getTaxAmount = () => {
        const amount = getcartamount();
        return amount > 0 ? (amount * 2 / 100).toFixed(2) : "0.00";
    };

    // Calculate total amount including tax
    const getTotalAmount = () => {
        const amount = getcartamount();
        return amount > 0 ? (amount + parseFloat(getTaxAmount())).toFixed(2) : "0.00";
    };

    // Handle cart item removal
    const handleRemoveItem = (productId) => {
        removeitemfromcart(productId);
        // The cart will automatically update through useEffect
    };

    useEffect(() => {
        if (products.length > 0) {
            getCart();
        }
    }, [products, cartItems]); // Added cartItems dependency

    useEffect(() => {
        if (user && user._id) {
            getUserAddress();
        }
    }, [user]);

    // Loading state
    if (!products.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Empty cart state
    if (cartArray.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] mt-16">
                <div className="text-center">
                    <h2 className="text-2xl font-medium text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add some products to your cart to continue shopping</p>
                    <button
                        onClick={() => {
                            navigate("/products");
                            window.scrollTo(0, 0);
                        }}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dull transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row mt-16 gap-8 px-4">
            {/* Cart Items */}
            <div className="flex-1 max-w-4xl">
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">({getcartcount()} items)</span>
                </h1>

                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                <div className="space-y-4 mt-4">
                    {cartArray.map((product) => (
                        <div
                            key={product._id}
                            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 md:gap-0 text-gray-500 items-center text-sm md:text-base font-medium py-4 border-b border-gray-100"
                        >
                            {/* Product Details */}
                            <div className="flex items-center gap-4">
                                <div className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        onClick={() => {
                                            navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        src={product.image[0]}
                                        alt={product.name}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 mb-1 truncate md:whitespace-normal">
                                        {product.name}
                                    </h3>
                                    <div className="font-normal text-gray-500 space-y-1">
                                        <p className="text-sm">
                                            Weight: <span className="text-gray-700">{product.weight || "N/A"}</span>
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm">Qty:</p>
                                            <select
                                                onChange={(e) => updateCart(product._id, Number(e.target.value))}
                                                value={product.quantity}
                                                className="outline-none cursor-pointer border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                disabled={isProcessing}
                                            >
                                                {Array.from({ length: Math.max(product.quantity, 10) }, (_, i) => i + 1).map(num => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-sm text-primary font-medium">
                                            {currency}{product.offerPrice} each
                                        </p>
                                    </div>

                                    {/* Subtotal + Action for mobile */}
                                    <div className="flex justify-between items-center mt-3 md:hidden">
                                        <p className="font-semibold text-gray-800 text-lg">
                                            {currency}{(product.offerPrice * product.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            className="cursor-pointer p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                            onClick={() => handleRemoveItem(product._id)}
                                            disabled={isProcessing}
                                            title="Remove item"
                                        >
                                            <img src={assets.remove_icon} alt="remove" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Subtotal (desktop only) */}
                            <div className="hidden md:block text-center">
                                <p className="font-semibold text-gray-800 text-lg">
                                    {currency}{(product.offerPrice * product.quantity).toFixed(2)}
                                </p>
                            </div>

                            {/* Action (desktop only) */}
                            <div className="hidden md:flex justify-center">
                                <button
                                    className="cursor-pointer p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                    onClick={() => handleRemoveItem(product._id)}
                                    disabled={isProcessing}
                                    title="Remove item"
                                >
                                    <img src={assets.remove_icon} alt="remove" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    ))}
                </div>

                <button
                    onClick={() => {
                        navigate("/products");
                        window.scrollTo(0, 0);
                    }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium hover:text-primary-dull transition-colors"
                    disabled={isProcessing}
                >
                    <img
                        className="group-hover:-translate-x-1 transition-transform"
                        src={assets.arrow_right_icon_colored}
                        alt="arrow"
                    />
                    Continue Shopping
                </button>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:max-w-[400px] bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                {/* Login Prompt for Non-Users */}
                {!user && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800 mb-2">Please login to continue with checkout</p>
                        <button
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dull transition-colors"
                        >
                            Login From The Top
                        </button>
                    </div>
                )}

                {/* Address Section - Only show if user is logged in */}
                {user && (
                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase text-gray-700 mb-3">Delivery Address</p>
                        <div className="relative">
                            {selectedAddress ? (
                                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {selectedAddress.street}, {selectedAddress.city},
                                                {selectedAddress.state}, {selectedAddress.country}
                                            </p>
                                            {selectedAddress.pincode && (
                                                <p className="text-gray-500 text-xs mt-1">PIN: {selectedAddress.pincode}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setShowAddress(!showAddress)}
                                            className="text-primary hover:text-primary-dull text-sm font-medium ml-2"
                                            disabled={isProcessing}
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 mb-3">No address selected</p>
                                    <button
                                        onClick={() => navigate("/add-address")}
                                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dull transition-colors"
                                        disabled={isProcessing}
                                    >
                                        Add Address
                                    </button>
                                </div>
                            )}

                            {/* Dropdown for changing address */}
                            {showAddress && address.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 mt-2 max-h-48 overflow-y-auto">
                                    {address.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => {
                                                setSelectedAddress(addr);
                                                setShowAddress(false);
                                            }}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <p className="text-gray-700 text-sm">
                                                {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                            </p>
                                            {addr.pincode && (
                                                <p className="text-gray-500 text-xs mt-1">PIN: {addr.pincode}</p>
                                            )}
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => navigate("/add-address")}
                                        className="p-3 text-center text-primary hover:bg-primary/10 cursor-pointer font-medium"
                                    >
                                        + Add new address
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <p className="text-l font-medium uppercase text-black mb-3 bg-white border border-gray-300 rounded-lg py-3 flex justify-center">
                                Select Payment Method
                            </p>

                            <select
                                onChange={(e) => setPaymentOptions(e.target.value)}
                                value={paymentOptions}
                                className="cursor-pointer text-black w-full border bg-primary text-white px-4 py-3 outline-none rounded-lg focus:ring focus:ring-primary"
                                disabled={isProcessing}
                            >
                                <option value="" className="bg-white text-black ">Not selected</option>
                                <option value="COD" className="bg-white text-black ">Cash On Delivery</option>
                                <option value="Online" className="bg-white text-black">Online Payment (Razorpay)</option>
                            </select>

                            {/* Show warning if nothing is selected */}
                            {paymentOptions === "" && (
                                <p className="mt-2 text-red-500 text-sm text-center">
                                    Please select a payment method to proceed.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <hr className="border-gray-300 mb-4" />

                {/* Price Summary */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({getcartcount()} items)</span>
                        <span className="font-medium">{currency}{getcartamount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping Fee</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax (2%)</span>
                        <span className="font-medium">{currency}{getTaxAmount()}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                        <span>Total Amount</span>
                        <span>{currency}{getTotalAmount()}</span>
                    </div>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={placeOrder}
                    className="w-full py-4 text-white font-semibold rounded-xl bg-primary hover:bg-primary-dull hover:shadow-lg transition-all"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </div>
                    ) : paymentOptions === "COD" ? (
                        "Place Order (COD)"
                    ) : paymentOptions === "Online" ? (
                        `Pay Online ${currency}${getTotalAmount()}`
                    ) : (
                        "Checkout"
                    )}
                </button>


                {paymentOptions === "Online" && user && (
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">
                            Secured by <span className="font-medium text-primary">Razorpay</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;