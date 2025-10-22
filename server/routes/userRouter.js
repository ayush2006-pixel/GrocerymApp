import express from "express";
import { isAuth, login, logout, register } from "../controllers/userController.js";
import AuthUser from "../middlewares/AuthUser.js";

const userRoute = express.Router();
userRoute.post("/register" , register);
userRoute.post("/login" , login);
userRoute.get("/is-auth" , AuthUser ,isAuth);
userRoute.get("/logout" , AuthUser , logout);

export default userRoute;