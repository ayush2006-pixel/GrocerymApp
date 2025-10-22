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
const port = 4000 || process.env.port;

await connectDb();
await cloudinaryConnect();
const allowedOrigins = [
  'http://localhost:4000',  // Remove trailing slash
  'http://localhost:5173',
  'https://grocerym-app.vercel.app/'  // Your frontend URL
];
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Working On')
})

app.use('/api/user' , userRoute)
app.use('/api/seller' , sellerRouter)
app.use('/api/product' , ProductRouter)
app.use('/api/cart' , cartRouter)
app.use('/api/address' , addressRouter)
app.use('/api/order' , orderRouter)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
