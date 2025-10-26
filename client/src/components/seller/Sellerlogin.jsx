import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const Sellerlogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();
    const [email, setEmail] = useState("admin@mail.com");
    const [password, setPassword] = useState("Ayush12345");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("/api/seller/login", { email, password });

            if (data.success) {
                toast.success(data.message);
                setIsSeller(true);
                navigate("/seller");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller]);

    return (
        !isSeller && (
            <form 
                onSubmit={onSubmitHandler}
                className='min-h-screen flex items-center text-sm text-gray-600 select-none' // disable selection globally in form
                onContextMenu={(e) => e.preventDefault()} // disable right-click
            >
                <div className='flex flex-col gap-5 m-auto items-start p-8 sm:p-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
                    <p className='text-2xl font-medium m-auto'>
                        <span className='text-primary'>Seller</span> Login
                    </p>

                    <div className='w-full'>
                        <p>Email</p>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            type="email" 
                            placeholder='Enter Email' 
                            required 
                            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' 
                        />
                    </div>

                    <div className='w-full'>
                        <p>Password</p>
                        <input
                            type="password"
                            value={password}
                            readOnly
                            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary select-none caret-transparent'
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>

                    <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'>
                        Login
                    </button>
                </div>
            </form>
        )
    );
};

export default Sellerlogin;
