import React, { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [inStock, setInStock] = useState(false);
    const [loading, setLoading] = useState(false);
    const { axios } = useAppContext();

    // Function to remove image
    const removeImage = (index) => {
        const updatedFiles = [...files];
        updatedFiles[index] = null;
        setFiles(updatedFiles);
    };

    const onSubmitHandeler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true); // 🔹 show loader

            const productData = {
                name,
                description: description.split("\n"),
                category,
                price,
                offerPrice,
                inStock
            }
            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            files.forEach((file, index) => {
                if (file) {
                    formData.append("images", file);
                }
            });

            const { data } = await axios.post("/api/product/add", formData)

            if (data.success) {
                toast.success(data.message);
                setName('')
                setDescription('')
                setCategory('')
                setPrice('')
                setOfferPrice('')
                setFiles([])
                setInStock(true)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false); // 🔹 hide loader after toast
        }
    }

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between relative">
            {/* 🔹 Full screen loader overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <form onSubmit={onSubmitHandeler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <div key={index} className="relative">
                                <label htmlFor={`image${index}`}>
                                    <input
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                        accept="image/*"
                                        type="file"
                                        id={`image${index}`}
                                        hidden
                                    />
                                    <img
                                        className="max-w-24 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                        src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                                        alt="uploadArea"
                                        width={100}
                                        height={100}
                                    />
                                </label>
                                {files[index] && (
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 text-black rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold shadow-lg transition-colors cursor-pointer"
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e) => (setName(e.target.value))} value={name} id="product-name" type="text" placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={(e) => (setDescription(e.target.value))} value={description} id="product-description" rows={4} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e) => (setCategory(e.target.value))} value={category} id="category" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e) => (setPrice(e.target.value))} value={price} id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={(e) => (setOfferPrice(e.target.value))} value={offerPrice} id="offer-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="text-base font-medium" htmlFor="in-stock">In Stock</label>
                    <input
                        type="checkbox"
                        id="in-stock"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4"
                    />
                </div>

                <button
                    className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer hover:bg-primary-dull disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    ADD
                </button>
            </form>
        </div>
    )
}

export default AddProduct;
