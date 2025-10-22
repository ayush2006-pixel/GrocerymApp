import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const { setShowUserLogin, setUser, axios,  setcartItems,cartItems } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

   const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
        // prepare payload
        const payload = state === "login" 
            ? { email, password, guestCart: cartItems }  // <-- include guestCart only on login
            : { name, email, password };

        const { data } = await axios.post(`/api/user/${state}`, payload);

        if (data.success) {
            toast.success(data.message);

            if (state === "register") {
                toast("Please login with your new account", { icon: "🔑" });
                setTimeout(() => {
                    setState("login");
                    setName("");
                    setPassword("");
                }, 400);
            } else { // login
                setUser(data.user);
                setcartItems(data.user.cartItems || {}); // <-- merged cart from backend
                setShowUserLogin(false);
                // navigate("/");
            }
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};


    return (
        <div
            onClick={() => setShowUserLogin(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="m-auto w-80 sm:w-[352px]"
            >
                <AnimatePresence mode="wait">
                    <motion.form
                        key={state} // 🔑 different key for login/register
                        onSubmit={onSubmitHandler}
                        // initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4 items-start p-8 py-12 rounded-lg shadow-xl border border-gray-200 bg-white"
                    >
                        <p className="text-2xl font-medium m-auto">
                            <span className='text-black'> {state === "login" ? "Already have Account" : "Create new Account"} </span> 
                        </p>

                        {state === "register" && (
                            <div className="w-full">
                                <p>Name</p>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="type here"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="text"
                                    required
                                />
                            </div>
                        )}

                        <div className="w-full">
                            <p>User Email</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="type here"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="email"
                                required
                            />
                        </div>

                        <div className="w-full relative">
                            <p>User Password</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="type here"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10"
                                type={showPassword ? "text" : "password"}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 cursor-pointer text-gray-600"
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </span>
                        </div>

                        {state === "register" ? (
                            <p>
                                Already have account?{" "}
                                <span onClick={() => setState("login")} className="text-primary cursor-pointer">
                                    click here
                                </span>
                            </p>
                        ) : (
                            <p className=''>
                                Create an account?{" "}
                                <span onClick={() => setState("register")} className="text-primary cursor-pointer">
                                    click here
                                </span>
                            </p>
                        )}

                        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                            {state === "register" ? "Create Account" : "Login"}
                        </button>
                    </motion.form>
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default Login;
