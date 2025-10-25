import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay"; 
import crypto from 'crypto';

// Verify Payment -> api/order/verify-payment
export const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature, 
            orderId 
        } = req.body;

        // Create signature for verification
        const hmac = crypto.createHmac('sha256', process.env.RAZOR_PAY_SECRET_KEY);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment verified - update order
            await Order.findByIdAndUpdate(orderId, { 
                isPaid: true,
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                paymentStatus: 'completed'
            });
            
            return res.json({ 
                success: true, 
                message: "Payment verified and order updated successfully" 
            });
        } else {
            // Update order as failed
            await Order.findByIdAndUpdate(orderId, { 
                paymentStatus: 'failed'
            });
            
            return res.json({ 
                success: false, 
                message: "Payment verification failed" 
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Place Order -> api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // Calculate amount properly
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }
            amount += product.offerPrice * item.quantity;
        }
        
        // Add 2% tax
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount: amount,
            address,
            paymentType: "COD",
            isPaid: false, // COD orders are not paid initially
            paymentStatus: 'pending'
        });
        
        return res.json({ success: true, message: "Successfully Order Placed" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Place Order -> api/order/online_payment/razor_pay
export const placeOrderRazor_pay = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }

        // Calculate amount
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }
            amount += product.offerPrice * item.quantity;
        }
        amount += parseFloat((amount * 0.02).toFixed(2));

        // Create order in your database first
        const order = await Order.create({
            userId,
            items,
            amount: amount,
            address,
            paymentType: "Online",
            isPaid: false, // Will be updated after payment verification
            paymentStatus: 'pending'
        });

        // Initialize Razorpay
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZOR_PAY_PUBLISHABLE_KEY,
            key_secret: process.env.RAZOR_PAY_SECRET_KEY,
        });

        // Create Razorpay order
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: order._id.toString(),
            notes: {
                orderId: order._id.toString(),
                userId: userId
            }
        });

        return res.json({ 
            success: true, 
            razorpayOrderId: razorpayOrder.id,
            amount: amount,
            currency: "INR",
            orderId: order._id,
            key: process.env.RAZOR_PAY_PUBLISHABLE_KEY // Send key to frontend
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Get Orders by User ID -> /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [
                { paymentType: "COD" }, 
                { paymentType: "Online", isPaid: true }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.log("Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get All Orders {for Admin/Seller} -> /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        console.log("✅ Seller authenticated, fetching all orders..."); // ✅ Add
        
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" }, 
                { paymentType: "Online", isPaid: true }
            ]
        }).populate("items.product address").sort({ createdAt: -1 });
        
        console.log("📦 Found orders:", orders.length); // ✅ Add
        
        return res.json({ success: true, orders });
    } catch (error) {
        console.error("❌ Error fetching orders:", error); // ✅ Add
        res.json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];
        
        if (!validStatuses.includes(status)) {
            return res.json({ 
                success: false, 
                message: "Invalid status. Valid statuses are: " + validStatuses.join(", ") 
            });
        }

        // Find and update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        // console.log(`Order ${orderId} status updated to: ${status}`);

        return res.json({ 
            success: true, 
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error('Update Order Status Error:', error);
        return res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    await Order.findByIdAndDelete(orderId);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};
