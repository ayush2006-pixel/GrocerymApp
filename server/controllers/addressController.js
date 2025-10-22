import Address from "../models/Address.js";


// Add Address -> api/address/add
export const addAddress = async (req, res) => {
    try {
        // Extract address object from request body (userId is included in address)
        const { address } = req.body;

        // Validate that address object exists
        if (!address) {
            return res.json({ success: false, message: "Address data is required" });
        }

        // console.log("Received address data:", address); // Debug log

        // Create new address with the provided data (userId is already in address object)
        const newAddress = await Address.create(address);

        return res.json({ success: true, message: "Successfully Address Added" });
    } catch (error) {
        console.log("Error adding address:", error.message);
        return res.json({ success: false, message: error.message })
    }
}

// Get Addres -> api/address/get
export const getAddress = async (req, res) => {
    try {
        // For GET request, get userId from query parameters
        const userId = req.query.userId;
        
        // console.log("Received userId:", userId); // Debug log
        
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const addresses = await Address.find({ userId });
        
        // console.log("Found addresses:", addresses); // Debug log
        
        if (addresses.length === 0) {
            return res.json({ success: false, message: "Add Address To Continue" });
        }

        return res.json({ success: true, addresses });
    } catch (error) {
        console.log("Error fetching addresses:", error.message);
        return res.json({ success: false, message: error.message });
    }
}