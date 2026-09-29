import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#0b0d13] text-[#f1f3f7]">
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <CreateRoom />
                    </ProtectedRoute>
                  }
                />
                <Route path="/join" element={<JoinRoom />} />
                <Route path="/room/:roomCode" element={<Room />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
