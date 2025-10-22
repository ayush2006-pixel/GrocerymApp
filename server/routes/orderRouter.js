import express from "express";
import AuthUser from "../middlewares/AuthUser.js";
import AuthSeller from "../middlewares/AuthSeller.js";
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazor_pay, verifyPayment,updateOrderStatus , deleteOrder} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cod", AuthUser, placeOrderCOD);
orderRouter.post("/user", AuthUser, getUserOrders);
// orderRouter.post('/online_payment/razor_pay', AuthUser, placeOrderRazor_pay); // Added AuthUser middleware
// orderRouter.post('/verify-payment', AuthUser, verifyPayment); // Added missing route
orderRouter.get("/seller", AuthSeller, getAllOrders);
orderRouter.put('/status/:orderId', AuthSeller, updateOrderStatus);
orderRouter.delete("/:orderId", AuthSeller, deleteOrder);


export default orderRouter;