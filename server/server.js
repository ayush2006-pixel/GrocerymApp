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

const allowedOrigins = [
  'http://localhost:5173',
  'https://grocerym-app.vercel.app'
];

// Apply middleware BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Health check route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Working' })
})

// API routes
app.use('/api/user', userRoute)
app.use('/api/seller', sellerRouter)
app.use('/api/product', ProductRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy: Origin not allowed' 
    });
  }
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// Start server function
const startServer = async () => {
  try {
    // Wait for DB connection first
    await connectDb();
    cloudinaryConnect();
    
    // Only start listening after DB is connected
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;