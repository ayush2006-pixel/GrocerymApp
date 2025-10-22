import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const InputField = ({ type, placeholder, name, handelChange, address }) => (
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-grey-500 focus:body-primary transition'
        type={type}
        placeholder={placeholder}
        onChange={handelChange}
        name={name}
        value={address[name]}
        required
    />
)

const Addaddress = () => {

    const { axios, user, navigate } = useAppContext();
    const [address, setaddress] = useState({
        first_name: '',
        last_name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    })
    
    const handelChange = (e) => {
        const { name, value } = e.target;
        setaddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }
    
    const onsubmithandeller = async (e) => {
        e.preventDefault();
        
        // Check if user is logged in
        if (!user) {
            toast.error("Please login to add address");
            navigate("/login");
            return;
        }
        
        try {
            // Debug: Log the user object to see its structure
            // console.log("Full user object:", user);
            // console.log("user._id:", user._id);
            // console.log("user.id:", user.id);
            // console.log("user.userId:", user.userId);
            
            // Try to get userId from different possible fields
            const userId = user._id;
            
            if (!userId) {
                toast.error("User ID not found. Please login again.");
                console.error("No userId found in user object:", user);
                return;
            }
            
            // Create address data with userId
            const addressData = {
                ...address,
                userId: userId
            };
            
            // console.log("Address data being sent:", addressData);
            
            const { data } = await axios.post("/api/address/add", { address: addressData });
            
            if (data.success) {
                toast.success(data.message);
                navigate("/cart");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        if (!user) {
            // toast.error("login First") 
            alert("login first")
        }
    }, [user])
    
    return (
        <div className='mt-16  pb-16'>
            <p className='text-2xl md:text-3xl text-grey-500'>Add Shipping <span className='font-semibold text-primary'>Address</span></p>
            <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
                <div className='flex-1 max-w-md'>
                    <form onSubmit={onsubmithandeller} className='space-y-3 mt-6 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handelChange={handelChange} address={address} name='first_name' type="text" placeholder="First Name" />
                            <InputField handelChange={handelChange} address={address} name='last_name' type="text" placeholder="Last Name" />
                        </div>
                        <InputField handelChange={handelChange} address={address} name='email' type="text" placeholder="Email" />
                        <InputField handelChange={handelChange} address={address} name='street' type="text" placeholder="Street" />
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handelChange={handelChange} address={address} name='city' type="text" placeholder="City" />
                            <InputField handelChange={handelChange} address={address} name='state' type="text" placeholder="State" />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handelChange={handelChange} address={address} name='zipcode' type="text" placeholder="Pin-Code" />
                            <InputField handelChange={handelChange} address={address} name='country' type="text" placeholder="Country" />
                        </div>
                        <InputField handelChange={handelChange} address={address} name='phone' type="text" placeholder="Phone Number" />
                        <button className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'>Save Address</button>
                    </form>
                </div>
                <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="Add address" />
            </div>
        </div>
    )
}

export default Addaddress