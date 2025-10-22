import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import Product_cart from '../components/Product_cart';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  // ✅ Filter products by category AND stock availability
  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category && product.inStock
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-3xl font-bold text-gray-900">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-31 h-0.75 bg-primary rounded-full"></div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {filteredProducts.map((product) => (
            <Product_cart key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-2xl font-medium text-primary">
            Sorry, We don't have any Related Products
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
