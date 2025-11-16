import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import socket from "./socket";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";

// API base (backend) URL from Vite env; falls back to localhost:5000
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Restore token + user once at the top
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth state
  const [user, setUser] = useState(() =>
    savedUser ? JSON.parse(savedUser) : null
  );
  const [name, setName] = useState(user?.name || "");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Profile editor state
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");

  // SOCKET EVENT LISTENERS
  useEffect(() => {
    const handleUserJoin = (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg }]);
    };

    const handleMessage = (data) => {
      if (typeof data === "string") {
        setMessages((prev) => [...prev, { system: true, text: data }]);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleStats = (stats) => {
      if (stats.totalMessages !== undefined)
        setTotalMessages(stats.totalMessages);
      if (stats.totalUsers !== undefined) setTotalUsers(stats.totalUsers);
    };

    socket.on("user-join", handleUserJoin);
    socket.on("user-leave", handleUserJoin);
    socket.on("message", handleMessage);
    socket.on("stats", handleStats);

    return () => {
      socket.off("user-join", handleUserJoin);
      socket.off("user-leave", handleUserJoin);
      socket.off("message", handleMessage);
      socket.off("stats", handleStats);
    };
  }, []);

  // REGISTER
  const register = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user: newUser } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        setName(newUser.name);
      }

      socket.connect();
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  // LOGIN

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setName(user.name);
      }

      socket.connect();
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  // LOGOUT

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
    setMessages([]);

    if (socket && socket.connected) {
      socket.emit("leave", { id: user?.id || name, name });
    }

    socket.disconnect();

    navigate("/login");
  };

  // PROFILE FUNCTIONS

  const openProfile = () => {
    setShowProfile(true);
    setProfileName(user?.name || "");
    setProfileEmail(user?.email || "");
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const updates = {
        name: profileName,
        email: profileEmail,
      };
      if (profilePassword) updates.password = profilePassword;

      const res = await axios.put(`${API}/api/auth/users/${user.id}`, updates);

      const updated = res.data;

      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setName(updated.name);

      setProfilePassword("");
      setShowProfile(false);

      alert("Profile updated");
    } catch (err) {
      alert(err.response?.data?.msg || "Error updating profile");
    }
  };

  // SEND MESSAGE

  const sendMessage = () => {
    if (!message.trim()) return;

    const payload = { user: name, message };

    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => socket.emit("message", payload));
    } else {
      socket.emit("message", payload);
    }

    setMessage("");
  };

  // FETCH MESSAGES ON ENTERING /chat
  useEffect(() => {
    if (location.pathname !== "/chat") return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/api/chat/messages?limit=200`);

        setMessages(res.data);

        const statsRes = await axios.get(`${API}/api/chat/stats`);
        setTotalMessages(statsRes.data.totalMessages || 0);
        setTotalUsers(statsRes.data.totalUsers || 0);
      } catch (err) {
        console.warn("Fetch messages failed:", err.message);
      }
    };

    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        socket.emit("join", { id: user?.id || name, name });
        fetchData();
      });
    } else {
      socket.emit("join", { id: user?.id || name, name });
      fetchData();
    }
  }, [location.pathname, name, user]);

  // ROUTES

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={savedToken ? "/chat" : "/register"} />}
      />

      <Route
        path="/register"
        element={
          <Register
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onRegister={register}
          />
        }
      />

      <Route
        path="/login"
        element={
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLogin={login}
          />
        }
      />

      <Route
        path="/chat"
        element={
          user ? (
            <ChatPage
              name={name}
              messages={messages}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              totalMessages={totalMessages}
              totalUsers={totalUsers}
              onLogout={logout}
              onEditProfile={openProfile}
              showProfile={showProfile}
              onCloseProfile={() => setShowProfile(false)}
              profileName={profileName}
              setProfileName={setProfileName}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              profilePassword={profilePassword}
              setProfilePassword={setProfilePassword}
              onUpdateProfile={updateProfile}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
