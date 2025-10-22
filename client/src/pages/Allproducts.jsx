import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Product_cart from '../components/Product_cart';

const Allproducts = () => {
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setfilteredProducts] = useState([]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setfilteredProducts(
                products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setfilteredProducts(products);
        }
    }, [products, searchQuery]);

    // Filter products that are in stock
    const inStockProducts = filteredProducts.filter(product => product.inStock);

    return (
        <div className='mt-16 flex flex-col'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-3xl font-bold text-gray-900'>All Products</p>
                <div className='w-35 h-0.75 bg-primary rounded-full'></div>
            </div>

            {inStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-16 space-y-4">
                    <p className="text-gray-500 text-lg font-semibold">No items found</p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                        Try adjusting your search or check back later.
                    </p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
                    {inStockProducts.map((product, index) => (
                        <Product_cart key={index} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Allproducts;
