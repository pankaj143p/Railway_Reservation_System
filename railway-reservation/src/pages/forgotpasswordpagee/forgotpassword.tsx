import React, { useState } from "react";
import { forgotPassword } from "../../services/api/userservce";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      // Replace with your actual frontend URL if needed
      const appUrl = window.location.origin;
      const response = await forgotPassword(email, appUrl);
      setMsg(response.message || "If your email exists, a reset link has been sent.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    }
  };


  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Forgot Password</h1>
      <form onSubmit={handleForgot} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          Send Reset Link
        </button>
      </form>
      {msg && <p className="mt-4 text-green-600 text-center">{msg}</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </div>
  );
};

export default ForgotPassword;