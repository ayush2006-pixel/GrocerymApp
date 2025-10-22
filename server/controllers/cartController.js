import User from "../models/User.js";  // add .js if using ES modules

export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({ success: false, message: "userId and cartItems are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartItems },
      { new: true } // return updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, message: "Cart updated", cart: updatedUser.cartItems });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
