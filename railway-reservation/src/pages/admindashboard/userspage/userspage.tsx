import React, { useEffect, useState } from "react";
import { User } from "../../../interfaces/User";
import { fetchUsers, addUser, updateUser, deleteUser } from "../../../services/api/userservce";
import UserForm from "../../../components/ui/userform/userform";

const EditIcon = () => (
  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleAdd = async (user: Partial<User>) => {
    const newUser = await addUser(user);
    setUsers([...users, newUser]);
  };

  const handleUpdate = async (user: Partial<User>) => {
    if (!editingUser) return;
    const updated = await updateUser(editingUser.id, user);
    setUsers(users.map(u => (u.id === editingUser.id ? updated : u)));
    setEditingUser(null);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="p4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-300 via-gray-400 to-blue-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 my-16">
        <h2 className="text-2xl font-bold text-blue-900">User Management</h2>
        <button
          onClick={() => { setEditingUser(null); setFormOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New User
        </button>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-3 mb-2 rounded-xl bg-blue-50/60 font-semibold text-blue-900">
          <div>ID</div>
          <div>Full Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div
              key={u.id}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center px-4 md:px-6 py-4 rounded-xl bg-white/30 backdrop-blur-lg border border-white/40 shadow transition hover:scale-[1.01]"
            >
              <div className="font-semibold text-blue-900">{u.id}</div>
              <div className="text-blue-900">{u.fullName}</div>
              <div className="text-blue-700/90 break-all">{u.email}</div>
              <div className="text-blue-700/90">{u.phone}</div>
              <div>
                <span className="px-3 py-1 bg-blue-100/60 rounded-full text-xs text-blue-700 font-medium">
                  {u.role}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingUser(u); setFormOpen(true); }}
                  className="p-2 rounded hover:bg-yellow-100 transition"
                  aria-label="Edit"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="p-2 rounded hover:bg-red-100 transition"
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center text-gray-400 py-8">No users found.</div>
          )}
        </div>
      </div>
      <UserForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingUser(null); }}
        onSubmit={editingUser ? handleUpdate : handleAdd}
        initialData={editingUser || undefined}
      />
    </div>
  );
};

export default UsersPage;