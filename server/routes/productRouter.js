import express from "express";
import { upload } from "../configs/multer.js";
import AuthSeller from "../middlewares/AuthSeller.js";
import { addProduct, changeStock, getProductList, getSingleProduct } from "../controllers/ProductConttroller.js";
const ProductRouter = express.Router();

ProductRouter.post("/add" , upload.array(["images"]) , AuthSeller , addProduct);
ProductRouter.get("/list" , getProductList)
ProductRouter.get("/id" , getSingleProduct)
ProductRouter.post("/stock" , AuthSeller, changeStock)

export default ProductRouter;