/*import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import NavBar from './components/NavBar'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import VideoCallManager from './components/VideoCallManager'
import { useChatStore } from './store/useChatStore'
import ForgotPassword from './pages/ForgotPassword'


const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (authUser) {
      useChatStore.getState().subscribeToMessages();
    }
  }, [authUser]);

  if(isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <NavBar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
        <Route path="/settings" element={authUser ? <SettingsPage/> : <Navigate to="/login"/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      
      <VideoCallManager/>
      <Toaster/>
    </div>
  );
};

export default App;*/

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NavBar from './components/NavBar';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import VideoCallManager from './components/VideoCallManager';
import { useChatStore } from './store/useChatStore';
import ForgotPassword from './pages/ForgotPassword';
import CallingOverlay from './components/CallingOverlay';
import IncomingCall from './components/IncomingCall';
import { useWebRTCStore } from './store/useWebRTCStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { users } = useChatStore();
  const {
    incomingCall,
    incomingCallerInfo,
    callingUser,
    localStream,
    endCall,
    acceptCall,
    rejectCall,
    currentCall
  } = useWebRTCStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (authUser) {
      useChatStore.getState().subscribeToMessages();
    }
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  const callerUser = users.find(u => u._id === incomingCallerInfo?._id);
  const calleeUser = users.find(u => u._id === callingUser?._id);

  return (
    <div data-theme={theme}>
      <NavBar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>

      <VideoCallManager />
      <Toaster />

      {callingUser && !incomingCall && (
  <CallingOverlay
    calleeName={calleeUser?.name || "User"}
    localStream={localStream}
    onCancel={endCall}
    
  />
)}

{incomingCall && !currentCall && (
  <IncomingCall
    callerName={callerUser?.name || "Unknown"}
    onAccept={() => acceptCall(incomingCall)}
    onReject={rejectCall}
  />
)}
    </div>
  );
};

export default App;
