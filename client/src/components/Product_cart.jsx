import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Product_cart = ({ product }) => {
    const { currency, addTocart, removeitemfromcart, updateCart, cartItems, navigate } = useAppContext();

    return product && (
        <div
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
            }}
            className="border border-gray-500/20 rounded-md px-2 md:px-4 py-2 bg-white w-full max-w-[240px] sm:max-w-[200px]"
        >
            <div className="group cursor-pointer flex items-center justify-center">
                <img
                    className="group-hover:scale-105 transition w-24 sm:w-28 md:w-36"
                    src={product.image[0]}
                    alt={product.name}
                />
            </div>

            <div className="text-gray-500/60 text-sm mt-2">
                <p className="text-xs sm:text-sm">{product.category}</p>
                <p className="text-gray-700 font-medium text-base sm:text-lg truncate">{product.name}</p>

                <div className="flex items-center gap-0.5 mt-1">
                    {Array(5).fill('').map((_, i) => (
                        <img
                            key={i}
                            className="w-3 sm:w-3.5"
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                            alt=""
                        />
                    ))}
                    <p className="text-xs sm:text-sm">(4)</p>
                </div>

                <div className="flex items-end justify-between mt-3">
                    <p className="text-base sm:text-lg font-medium text-primary">
                        {currency}{product.offerPrice}
                        <span className="text-gray-500/60 text-xs sm:text-sm line-through ml-1">
                            {currency}{product.price}
                        </span>
                    </p>

                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="text-primary"
                    >
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/20 border border-primary/0 w-[60px] sm:w-[72px] h-[30px] rounded text-primary text-xs sm:text-sm font-medium cursor-pointer"
                                onClick={() => addTocart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-4 sm:w-5" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-[60px] sm:w-16 h-[30px] bg-primary/25 rounded select-none">
                                <button
                                    onClick={() => removeitemfromcart(product._id)}
                                    className="cursor-pointer text-xs sm:text-sm px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-4 text-center text-sm">{cartItems[product._id]}</span>
                                <button
                                    onClick={() => addTocart(product._id)}
                                    className="cursor-pointer text-xs sm:text-sm px-2 h-full"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product_cart;
