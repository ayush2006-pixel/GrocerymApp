import express from "express";
import { seller_isAuth, seller_login, seller_logout } from "../controllers/sellerController.js";
import AuthSeller from "../middlewares/AuthSeller.js";

const sellerRouter = express.Router();

sellerRouter.post("/login" , seller_login);
sellerRouter.post("/logout" , AuthSeller , seller_logout);
sellerRouter.post("/is-auth" ,AuthSeller, seller_isAuth);

export default sellerRouter;