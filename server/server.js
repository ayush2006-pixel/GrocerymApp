import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDb from "./configs/db.js";
import "dotenv/config"
import userRoute from "./routes/userRouter.js";
import sellerRouter from "./routes/sellerRouter.js";
import cloudinaryConnect from "./configs/cloudinary.js";
import ProductRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import addressRouter from "./routes/addressRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();
const port = process.env.PORT || 4000;

connectDb();
cloudinaryConnect();

const allowedOrigins = [
  'http://localhost:5173', 
  'https://grocerym-app.vercel.app'
];

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Don't throw error
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Working' })
})

app.use('/api/user', userRoute)
app.use('/api/seller', sellerRouter)
app.use('/api/product', ProductRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message });
});

// Only listen in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}

// 🚨 CRITICAL: Export for Vercel
export default app;