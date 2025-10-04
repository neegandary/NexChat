import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";

export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAppStore();

    const handleLogout = async () => {
        // // Show confirmation dialog if requested
        // if (showConfirmation) {
        //     const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        //     if (!confirmed) return;
        // }

        try {
            // Show loading toast
            const loadingToast = toast.loading("Đang đăng xuất...");

            // Call logout API to clear server-side cookie
            await apiClient.post(LOGOUT_ROUTE);

            // Clear client-side data
            logout();

            // Dismiss loading and show success
            toast.dismiss(loadingToast);
            toast.success("Đăng xuất thành công!");

            // Navigate to login page
            navigate("/auth/login");
        } catch (error) {
            console.error("Logout error:", error);

            // Even if API call fails, still logout locally
            logout();
            toast.info("Đã đăng xuất cục bộ");
            navigate("/auth/login");
        }
    };

    return { handleLogout };
};