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
const allowedOrigins = ['http://localhost:4000/','http://localhost:5173','https://grocerym-app-fdmv.vercel.app/']
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins , credentials : true}));

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
