import express from "express";
import AuthUser from "../middlewares/AuthUser.js";
import { updateCart } from "../controllers/cartController.js";

const cartRouter = express.Router();
cartRouter.post("/update" , AuthUser , updateCart)  
export default cartRouter;