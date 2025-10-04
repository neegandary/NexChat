import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import apiClient from "../../lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import { motion } from "motion/react";

const RegisterAuth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateSignup = () => {
        if (!firstName.length) {
            toast.error("First name is required");
            return false;
        }
        if (!lastName.length) {
            toast.error("Last name is required");
            return false;
        }
        if (!email.length) {
            toast.error("Email is required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validateSignup()) {
            try {
                const response = await apiClient.post(SIGNUP_ROUTE,
                    { email, password, firstName, lastName, confirmPassword },
                    { withCredentials: true }
                )
                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    toast.success("Account created successfully!");
                    // Since user provided firstName and lastName during registration,
                    // profileSetup will be true, so redirect to chat
                    navigate("/chat");
                }
            } catch (error) {
                console.log(error);
                if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Registration failed. Please try again.");
                }
            }
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-black">
            <div className="h-[85vh] bg-[#F6F6F6] border-2 border-[#767C8C] text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-8 items-center justify-center p-8">
                    <div className="flex items-center justify-center flex-col">
                        <h1 className="text-4xl font-bold md:text-5xl mb-[20px] text-black font-sf-pro">Create Account</h1>
                        <p className="text-[#767C8C] text-center mb-6">Join NexChat and start connecting</p>
                        <div className="flex items-center justify-center">
                            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                                <div className="flex flex-col gap-4">
                                    {/* Name Fields */}
                                    <div className="flex gap-3">
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            onChange={(e) => setFirstName(e.target.value)}
                                            value={firstName}
                                            placeholder="First Name"
                                            className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-32 md:w-38 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                        />
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            onChange={(e) => setLastName(e.target.value)}
                                            value={lastName}
                                            placeholder="Last Name"
                                            className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-32 md:w-38 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        placeholder="Email Address"
                                        className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-64 md:w-80 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    />

                                    {/* Password Fields */}
                                    <input
                                        id="password"
                                        name="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        placeholder="Password"
                                        className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-64 md:w-80 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="border-2 border-[#767C8C] bg-[#EBEDF0] text-black placeholder-[#767C8C] rounded-lg p-3 w-64 md:w-80 focus:outline-none focus:border-black focus:bg-white transition-all duration-300"
                                    />

                                    {/* Submit Button */}
                                    <button
                                        className="bg-black text-[#F6F6F6] rounded-lg p-3 hover:bg-[#767C8C] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl mt-2"
                                        type="submit"
                                    >
                                        Create Account
                                    </button>
                                </div>

                                {/* Login Link */}
                                <div className="text-center mt-4 pt-4 border-t border-[#EBEDF0]">
                                    <p className="text-[#767C8C] text-sm mb-2">Already have an account?</p>
                                    <Link
                                        to="/auth/login"
                                        className="text-black font-semibold hover:text-[#767C8C] transition-all duration-300 text-lg underline decoration-2 underline-offset-4 decoration-[#EBEDF0] hover:decoration-[#767C8C]"
                                    >
                                        Login Here
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
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
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            whileHover={{
                                scale: 1.15,
                                rotate: 0,
                                transition: { duration: 0.4 }
                            }}
                        >
                            <motion.div
                                className="w-24 h-24 rounded-full bg-black flex items-center justify-center"
                                animate={{
                                    rotate: -360,
                                }}
                                transition={{
                                    duration: 18,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-full bg-[#F6F6F6]"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [1, 0.7, 1],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                ></motion.div>
                            </motion.div>
                        </motion.div>

                        <motion.h2
                            className="text-3xl font-bold text-[#F6F6F6] mb-4 font-sf-pro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
                        >
                            Join NexChat
                        </motion.h2>

                        <motion.p
                            className="text-[#767C8C] text-lg px-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.9, ease: "easeOut" }}
                        >
                            Create your account and start your journey with us
                        </motion.p>

                        {/* Features List */}
                        <motion.div
                            className="mt-8 p-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            {[
                                "Real-time messaging",
                                "Secure conversations",
                                "Connect anywhere"
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    className="flex items-center mb-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 1.4 + (index * 0.2),
                                        duration: 0.6,
                                        ease: "easeOut"
                                    }}
                                >
                                    <motion.div
                                        className="w-2 h-2 bg-[#767C8C] rounded-full mr-3"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.3,
                                            ease: "easeInOut"
                                        }}
                                    ></motion.div>
                                    <span className="text-[#EBEDF0] text-sm">{feature}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterAuth