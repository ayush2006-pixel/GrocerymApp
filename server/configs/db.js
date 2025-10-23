import mongoose from "mongoose";

const connectDb = async () => {
    try {
        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);
        
        mongoose.connection.on("connected", () => {
            console.log('✅ MongoDB Connected Successfully');
        });
        
        mongoose.connection.on("error", (err) => {
            console.error('❌ MongoDB Connection Error:', err);
        });
        
        mongoose.connection.on("disconnected", () => {
            console.log('⚠️ MongoDB Disconnected');
        });

        // Wait for the connection to establish
        const conn = await mongoose.connect(`${process.env.MONGODB_URL}/GreenCart`, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4, skip trying IPv6
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
        
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1); // Exit if can't connect
    }
}

export default connectDb;