import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword, validateToken } from "../../services/api/userservce";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (token) {
      validateToken(token)
        .then(() => setTokenValid(true))
        .catch(() => setTokenValid(false));
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      const response = await resetPassword(token, newPassword);
      setMsg(response.message || "Password reset successful.");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    }
  };

  if (!token) return <div className="text-center mt-16 text-red-600">Invalid reset link.</div>;
  if (tokenValid === null) return <div className="text-center mt-16">Checking token...</div>;
  if (tokenValid === false) return <div className="text-center mt-16 text-red-600">Invalid or expired token.</div>;

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          required
          onChange={e => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
        >
          Reset Password
        </button>
      </form>
      {msg && <div className="mt-4 text-green-600 text-center">{msg}</div>}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  );
};

export default ResetPasswordPage;