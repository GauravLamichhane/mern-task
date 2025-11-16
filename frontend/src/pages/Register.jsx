import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onRegister,
  loading,
  error,
}) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 
                       text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 
                       focus:ring-blue-500"
            required
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition
            ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
