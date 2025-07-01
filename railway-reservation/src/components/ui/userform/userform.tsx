import React, { useState, useEffect } from "react";
import { User } from "../../../interfaces/User";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  initialData?: Partial<User>;
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<Partial<User>>({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    setForm(
      initialData
        ? { ...initialData, password: "" }
        : { fullName: "", email: "", phone: "", role: "", password: "" }
    );
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send password if registering (not editing)
    const submitData = { ...form };
    if (initialData) {
      delete submitData.password;
    }
    onSubmit(submitData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">{initialData ? "Edit User" : "Add New User"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 bg-white/60 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 bg-white/60 px-1">
              Full Name
            </label>
          </div>
          <div className="relative">
            <input
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 bg-white/60 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
              type="email"
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 bg-white/60 px-1">
              Email
            </label>
          </div>
          <div className="relative">
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 bg-white/60 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
              type="tel"
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 bg-white/60 px-1">
              Phone
            </label>
          </div>
          <div className="relative">
            <input
              name="role"
              value={form.role || ""}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full border border-gray-300 bg-white/60 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 bg-white/60 px-1">
              Role
            </label>
          </div>
          {/* Show password field only when adding a new user */}
          {!initialData && (
            <div className="relative">
              <input
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full border border-gray-300 bg-white/60 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                required
                type="password"
                autoComplete="new-password"
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-500 bg-white/60 px-1">
                Password
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;