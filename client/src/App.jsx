import React, { useEffect, useState } from 'react'
import LoginAuth from './pages/auth/loginAuth'
import RegisterAuth from './pages/auth/registerAuth'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/chat'
import Profile from './pages/profile'
import Dashboard from './pages/dashboard'
import Setup from './pages/setup'
import CRM from './pages/crm'
import Accounts from './pages/accounts'
import { useAppStore } from './store'
import apiClient from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!userInfo || !!token;
  return isAuthenticated ? children : <Navigate to="/auth/login" />
}
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!userInfo || !!token;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

function App() {
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize dark mode
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = savedTheme ? savedTheme === 'true' : prefersDark;

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Get user data
    const getUserData = async () => {
      try {
        // Check if we have a token first
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }

      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, [setUserInfo])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={
            <AuthRoute>
              <LoginAuth />
            </AuthRoute>
          } />
          <Route path="/auth/register" element={
            <AuthRoute>
              <RegisterAuth />
            </AuthRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          <Route path="/setup" element={
            <PrivateRoute>
              <Setup />
            </PrivateRoute>
          } />
          <Route path="/crm" element={
            <PrivateRoute>
              <CRM />
            </PrivateRoute>
          } />
          <Route path="/accounts" element={
            <PrivateRoute>
              <Accounts />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/auth" element={<Navigate to="/auth/login" />} />
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App