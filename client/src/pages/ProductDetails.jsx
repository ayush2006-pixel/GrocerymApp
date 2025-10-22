import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Product_cart from "../components/Product_cart";

const ProductDetails = () => {
    const { products, navigate, currency, addTocart } = useAppContext();
    const { id } = useParams();
    const [relatedProducts, setrelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    // find individual product from id 
    const product = products.find((item) => item._id === id);
    //related product ka data
    useEffect(() => {
        if (product) {
            let productCopy = products.slice();
            productCopy = productCopy.filter((item) => product.category === item.category);
            setrelatedProducts(productCopy.slice(0, 5));
        }
    }, [product, products]);
    // product thumbnail
    useEffect(() => {
        setThumbnail(product?.image?.[0] || null);
    }, [product]);

    return product && (
        //Breadcrums {home/product/vegies/patato}
        <div className="mt-12">
            <p>
                <Link to={"/"}>Home</Link> /
                <Link to={"/products"}> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`}> {product.category}</Link> /
                <span className="text-indigo-500"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />
                        ))}
                        <p className="text-base ml-2">(4)</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium">MRP: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70">(inclusive of all taxes)</span>
                    </div>

                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addTocart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition" >
                            Add to Cart
                        </button>
                        <button onClick={() => {addTocart(product._id); navigate('/cart')}} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* For showing all the related products from the above selected product*/}
            <div>
                <div className="flex flex-col items-center mt-20">
                    <p className="text-2xl font-medium">Related Products</p>
                    <div className='w-31 h-0.75 bg-primary rounded-full'></div>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                    {relatedProducts.filter((product) => product.inStock).map((product, index) => (
                        <Product_cart key={index} product={product} />
                    ))}
                </div>
                <button onClick={()=>{navigate('/products'); scrollTo(0,0) }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition flex items-center">See More</button>
            </div>
        </div>
    );
};

export default ProductDetails;
