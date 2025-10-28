import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import { User, Eye, EyeOff } from "lucide-react";

const Accounts = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateProfile = () => {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  const handleSaveProfile = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE, {
          firstName,
          lastName,
          password: password || undefined
        }, { withCredentials: true });

        if (response.status === 200) {
          setUserInfo(response.data.user);
          setPassword("");
          setConfirmPassword("");
          toast.success("Profile updated successfully");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-[#F6F6F6] flex">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Account Settings</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-6">Profile Information</h2>

          {/* Profile Avatar */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {userInfo.image ? (
                  <img src={userInfo.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <p className="text-sm text-[#767C8C] mt-2">Profile Picture</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#767C8C] mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-2 border-[#EBEDF0] bg-white text-black rounded-lg p-3 focus:outline-none focus:border-black transition-all duration-300"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#767C8C] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-2 border-[#EBEDF0] bg-white text-black rounded-lg p-3 focus:outline-none focus:border-black transition-all duration-300"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email (Read Only) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#767C8C] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userInfo.email}
                className="w-full border-2 border-[#EBEDF0] bg-[#F6F6F6] text-[#767C8C] rounded-lg p-3 cursor-not-allowed"
                placeholder="Enter your email"
                readOnly
              />
              <p className="text-xs text-[#767C8C] mt-1">Email cannot be changed</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#767C8C] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-[#EBEDF0] bg-white text-black rounded-lg p-3 pr-12 focus:outline-none focus:border-black transition-all duration-300"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#767C8C] hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-[#767C8C] mt-1">Leave blank to keep current password</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#767C8C] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-2 border-[#EBEDF0] bg-white text-black rounded-lg p-3 pr-12 focus:outline-none focus:border-black transition-all duration-300"
                  placeholder="Confirm new password"
                  disabled={!password}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#767C8C] hover:text-black"
                  disabled={!password}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-[#767C8C] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">Account Status</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${userInfo.profileSetup ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-[#767C8C]">
                Profile Setup: {userInfo.profileSetup ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;