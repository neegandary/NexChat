import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { motion } from "motion/react";

const LoginAuth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateLogin()) {
            try {
                const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
                if (response.data.user.id) {
                    setUserInfo(response.data.user);
                    toast.success("Login successful!");
                    if (response.data.user.profileSetup) {
                        navigate("/chat");
                    } else {
                        navigate("/accounts");
                    }
                }
            } catch (error) {
                console.log(error)
                toast.error("Login failed. Please check your credentials.");
            }
        }
    }
    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-black">
            <div className="h-[80vh] bg-[#F6F6F6] border-2 border-[#767C8C] text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <h1 className="text-5xl font-bold md:text-6xl mb-[20px] text-black font-sf-pro">Login</h1>
                        <div className="flex items-center justify-center">
                            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                                <div className="flex flex-col gap-4">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        placeholder="Email"
                                        className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-64 md:w-80 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    />
                                    <input
                                        id="password"
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        placeholder="Password"
                                        className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-64 md:w-80 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    />
                                    <button
                                        className="bg-black text-[#F6F6F6] rounded-lg p-3 hover:bg-[#767C8C] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                                        type="submit"
                                    >
                                        Login
                                    </button>
                                </div>
                                <div className="text-center mt-6 pt-4 border-t border-[#EBEDF0]">
                                    <p className="text-[#767C8C] text-sm mb-2">Don't have an account?</p>
                                    <Link
                                        to="/auth/register"
                                        className="text-black font-semibold hover:text-[#767C8C] transition-all duration-300 text-lg underline decoration-2 underline-offset-4 decoration-[#EBEDF0] hover:decoration-[#767C8C]"
                                    >
                                        Register Here
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="hidden xl:flex items-center justify-center bg-black rounded-r-3xl">
                    <div className="text-center">
                        <motion.div
                            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#767C8C] to-[#EBEDF0] flex items-center justify-center"
                            animate={{
                                rotate: 360,
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                rotate: {
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: 0,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <motion.div
                                className="w-24 h-24 rounded-full bg-black flex items-center justify-center"
                                animate={{
                                    rotate: -360,
                                }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-[#F6F6F6]"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [1, 0.8, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                ></motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.h2
                            className="text-3xl font-bold text-[#F6F6F6] mb-4 font-sf-pro"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                        >
                            Welcome to NexChat
                        </motion.h2>
                        <motion.p
                            className="text-[#767C8C] text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        >
                            Connect with friends and family
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginAuth