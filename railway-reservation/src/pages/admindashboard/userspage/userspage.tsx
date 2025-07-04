import React, { useEffect, useState } from "react";
import { User } from "../../../interfaces/User";
import { fetchUsers, createUser, updateUser, deleteUser, reactivateUser } from "../../../services/api/userservce";
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

const ReactivateIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const data = await fetchUsers();
      console.log("Users fetched:", data, "Type:", typeof data, "Is Array:", Array.isArray(data));
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("fetchUsers did not return an array:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (userData: Partial<User>) => {
    try {
      console.log("Adding user:", userData);
      const newUser = await createUser(userData as Omit<User, 'id'>);
      console.log("User created:", newUser);
      
      // Refresh the users list to get the latest data
      await loadUsers();
      setFormOpen(false);
    } catch (err) {
      console.error("Add user error:", err);
      alert("Failed to add user. See console for details.");
    }
  };

  const handleUpdate = async (userData: Partial<User>) => {
    if (!editingUser) return;
    
    try {
      console.log("Updating user:", editingUser.id, userData);
      const updated = await updateUser(editingUser.id, userData);
      console.log("User updated:", updated);
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...updated } 
            : u
        )
      );
      
      setEditingUser(null);
      setFormOpen(false);
    } catch (err) {
      console.error("Update user error:", err);
      alert("Failed to update user. See console for details.");
    }
  };

  const handleDelete = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      console.log("Deleting user:", userToDelete.id);
      await deleteUser(userToDelete.id);
      
      // Update the user in the list to mark as inactive (soft delete)
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userToDelete.id 
            ? { ...u, isActive: false } 
            : u
        )
      );
      
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Failed to delete user. See console for details.");
    }
  };

  const handleReactivate = async (userId: number) => {
    try {
      console.log("Reactivating user:", userId);
      await reactivateUser(userId);
      
      // Update the user in the list to mark as active
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, isActive: true } 
            : u
        )
      );
    } catch (err) {
      console.error("Reactivate user error:", err);
      alert("Failed to reactivate user. See console for details.");
    }
  };

  const handleEditUser = (user: User) => {
    console.log("Editing user:", user);
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleAddNewUser = () => {
    console.log("Adding new user");
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => showInactive || user.isActive !== false);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-300 via-gray-400 to-blue-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-blue-900 text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-blue-300 via-gray-400 to-blue-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 my-16">
        <h2 className="text-2xl font-bold text-blue-900">User Management</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-blue-900">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded"
            />
            Show Inactive Users
          </label>
          <button
            onClick={handleAddNewUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            + Add New User
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-3 mb-2 rounded-xl bg-blue-50/60 font-semibold text-blue-900 text-sm">
          <div>ID</div>
          <div>Full Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`grid grid-cols-2 md:grid-cols-7 gap-4 items-center px-4 md:px-6 py-4 rounded-xl backdrop-blur-lg border border-white/40 shadow transition hover:scale-[1.01] text-sm ${
                user.isActive === false ? 'bg-gray-200/30 opacity-60' : 'bg-white/30'
              }`}
            >
              <div className="font-semibold text-blue-900">{user.id}</div>
              <div className="text-blue-900">{user.fullName}</div>
              <div className="text-blue-700/90 break-all text-xs">{user.email}</div>
              <div className="text-blue-700/90">{user.phone}</div>
              <div>
                <span className="px-3 py-1 bg-blue-100/60 rounded-full text-xs text-blue-700 font-medium">
                  {user.role}
                </span>
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 rounded hover:bg-yellow-100 transition"
                  aria-label="Edit"
                  title="Edit User"
                >
                  <EditIcon />
                </button>
                {user.isActive !== false ? (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 rounded hover:bg-red-100 transition"
                    aria-label="Delete"
                    title="Delete User"
                  >
                    <DeleteIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(user.id)}
                    className="p-2 rounded hover:bg-green-100 transition"
                    aria-label="Reactivate User"
                    title="Reactivate User"
                  >
                    <ReactivateIcon />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {users.length === 0 
                ? "No users found." 
                : "No active users found. Check 'Show Inactive Users' to see all users."
              }
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete user "{userToDelete?.fullName}"? This will mark the user as inactive.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <UserForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingUser ? handleUpdate : handleAdd}
        initialData={editingUser || undefined}
      />
    </div>
  );
};

export default UsersPage;