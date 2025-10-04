import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard accounts section instead of showing profile page
    navigate("/dashboard/accounts", { replace: true });
  }, [navigate]);

  // This component will redirect, but show loading state briefly
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Redirecting to Dashboard...</div>
    </div>
  )
}

export default Profile