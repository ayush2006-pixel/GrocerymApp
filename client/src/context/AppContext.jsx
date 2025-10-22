import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// withCredentials = true → “Always send cookies/auth with requests.”
// baseURL = ... → “Prefix all requests with this backend URL automatically.”

export const AppContext = createContext();
export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setproducts] = useState([])
    const [cartItems, setcartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    // Fetch Seller-Status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth")
            if (data.success) {
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch (error) {
            console.log(error.message);
            setIsSeller(false)
        }
    }

    // Fetch User Auth Status , User Data and Cart Items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user)
                setcartItems(data.user.cartItems)
            }

        } catch (error) {
            setUser(null);
            console.log(error.message);

        }
    }

    //Fetching all the products
    const fetchproducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list")
            if (data.success) {
                setproducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Add products //chnaged
    const addTocart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setcartItems(cartData)
        toast.success("Added to Cart")
    }

    // Update Cart
    const updateCart = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setcartItems(cartData);
        toast.success("Cart Updated");
    };

    //Remove from Cart
    const removeitemfromcart = (itemId) => {
        let cartData = structuredClone(cartItems)
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setcartItems(cartData)
    };
    // cart count
    let getcartcount = () => {
        let totalcount = 0;
        for (const item in cartItems) {
            totalcount += cartItems[item];
        }
        return totalcount;
    }

    //return cart total amount 
    const getcartamount = () => {
        let totalamount = 0;
        for (const items in cartItems) {
            let iteminfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalamount += iteminfo.offerPrice * cartItems[items]
            }
        } return Math.floor(totalamount * 100) / 100;
    }

    useEffect(() => {
        fetchproducts()
        fetchSeller()
        fetchUser()
    }, [])


    //Update DB cart items
    useEffect(() => {
        if(!user) return;
     const updateCart = async () => {
        try {
            const { data } = await axios.post("/api/cart/update" , {cartItems})
            if(!data.success){
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
     }
     if(user){
        updateCart()
     }
    },[cartItems])

    const value = { navigate, user, setUser, setIsSeller, isSeller, showUserLogin, setShowUserLogin, products, currency, addTocart, updateCart, setcartItems , removeitemfromcart, cartItems, searchQuery, setSearchQuery, getcartamount, getcartcount, axios, fetchproducts }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}

