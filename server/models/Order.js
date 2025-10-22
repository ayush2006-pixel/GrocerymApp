import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true }, // Changed from String to Number
    }],
    amount: { type: Number, required: true }, // Changed from String to Number
    address: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Address" },
    status: { 
        type: String, 
        enum: [
            "Order Placed", 
            "Packing", 
            "Shipped", 
            "Out for Delivery", 
            "Delivered"
        ], 
        default: "Order Placed" 
    },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, default: false }, // Removed duplicate field
    razorpayPaymentId: {
        type: String,
        default: null
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    paymentStatus: { 
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;