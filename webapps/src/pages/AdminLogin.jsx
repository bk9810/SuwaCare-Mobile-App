import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/AdminLogin.css'

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple static login (replace with backend API later)
    if (username === "admin" && password === "admin123") {
      navigate("/admin");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
  <form onSubmit={handleLogin} className="login-form">
    <h2>Admin Login</h2>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button type="submit">Login</button>
  </form>
</div>
  );
}
