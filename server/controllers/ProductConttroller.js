import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js";


// Add-Products = /api/product/add

export const addProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData);
        const images = req.files;

         if (!images || images.length === 0) {
            return res.json({ success: false, message: "At least one image is required" });
        }

        // Upload all images to Cloudinary
        let imageUrls = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, {
                    resource_type: "image",
                     transformation: [
                            { width: 800, height: 800, crop: "limit" }, // Optimize image size
                            { quality: "auto" }
                        ]
                });
                return result.secure_url;
            })
        );

        await Product.create({ ...productData, image: imageUrls })
        return res.json({ success: true, message: "Successfully Item Added in Seller Account" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get-ProductList = /api/product/list
export const getProductList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Single Product = /api/product/id
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.body;
         if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//Change Product In Stock = /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { id , inStock } = req.body;
         if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }
        await Product.findByIdAndUpdate(id, { inStock })
        return res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
} 