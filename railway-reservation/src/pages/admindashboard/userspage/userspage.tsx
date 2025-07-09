import React, { useEffect, useState, useMemo } from "react";
import { User } from "../../../interfaces/User";
import { fetchUsers, createUser, updateUser, deleteUser, reactivateUser } from "../../../services/api/userservce";
import UserForm from "../../../components/ui/userform/userform";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Alert from '@mui/material/Alert';


const EditIcon = () => (
  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
  </svg>
);

const DeleteIcon = () => (
  <FontAwesomeIcon icon={faTrash} style={{color: "#c92222"}} />
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Reset to first page when showInactive changes
  useEffect(() => {
    setCurrentPage(1);
  }, [showInactive]);

  // Calculate filtered users and pagination
  const { filteredUsers, totalPages, paginatedUsers } = useMemo(() => {
    const usersArray = Array.isArray(users) ? users : [];
    const filtered = usersArray.filter(user => showInactive || user.isActive !== false);
    const total = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      filteredUsers: filtered,
      totalPages: total,
      paginatedUsers: paginated
    };
  }, [users, showInactive, currentPage, itemsPerPage]);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

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
      showAlert('error', 'Failed to fetch users. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      console.log("Adding user:", userData);
      const newUser = await createUser(userData as Omit<User, 'id'>);
      console.log("User created:", newUser);
      
      // Refresh the users list to get the latest data
      await loadUsers();
      setFormOpen(false);
      setEditingUser(null);
      showAlert('success', 'User added successfully!');
    } catch (err) {
      console.error("Add user error:", err);
      showAlert('error', 'Failed to add user. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userData: Partial<User>) => {
    if (!editingUser) return;
    
    setLoading(true);
    try {
      console.log("Updating user:", editingUser.id, userData);
      const updated = await updateUser(editingUser.id, userData);
      console.log("User updated:", updated);
      
      // Refresh the users list to get the latest data
      await loadUsers();
      
      setEditingUser(null);
      setFormOpen(false);
      showAlert('success', 'User updated successfully!');
    } catch (err) {
      console.error("Update user error:", err);
      showAlert('error', 'Failed to update user. Please check the console for details.');
    } finally {
      setLoading(false);
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
    
    setLoading(true);
    try {
      console.log("Deleting user:", userToDelete.id);
      await deleteUser(userToDelete.id);
      
      // Refresh the users list
      await loadUsers();
      
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      showAlert('success', 'User deactivated successfully!');
    } catch (err) {
      console.error("Delete user error:", err);
      showAlert('error', 'Failed to deactivate user. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (userId: number) => {
    setLoading(true);
    try {
      console.log("Reactivating user:", userId);
      await reactivateUser(userId);
      
      // Refresh the users list
      await loadUsers();
      showAlert('success', 'User reactivated successfully!');
    } catch (err) {
      console.error("Reactivate user error:", err);
      showAlert('error', 'Failed to reactivate user. Please check the console for details.');
    } finally {
      setLoading(false);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
    );

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 transition"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2 text-blue-900">...</span>);
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-lg backdrop-blur-lg border transition ${
            currentPage === i
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white/30 border-white/40 text-blue-900 hover:bg-blue-100/50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2 text-blue-900">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 transition"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 mx-1 rounded-lg bg-white/30 backdrop-blur-lg border border-white/40 text-blue-900 hover:bg-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    );

    return buttons;
  };

  if (loading && users.length === 0) {
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
      {/* Alert Component */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert 
            variant="outlined" 
            severity={alert.type}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 my-16">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">User Management</h2>
          <p className="text-blue-700 text-sm mt-1">
            Showing {paginatedUsers.length} of {filteredUsers.length} users 
            {filteredUsers.length > itemsPerPage && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>
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
            disabled={loading}
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
          {paginatedUsers.map(user => (
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
                  disabled={loading}
                >
                  <EditIcon />
                </button>
                {user.isActive !== false ? (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 rounded hover:bg-red-100 transition"
                    aria-label="Delete"
                    title="Delete User"
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => handleReactivate(user.id)}
                    className="p-2 rounded hover:bg-green-100 transition"
                    aria-label="Reactivate User"
                    title="Reactivate User"
                    disabled={loading}
                  >
                    <ReactivateIcon />
                  </button>
                )}
              </div>
            </div>
          ))}

          {paginatedUsers.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              {users.length === 0 
                ? "No users found." 
                : "No active users found. Check 'Show Inactive Users' to see all users."
              }
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <div className="flex items-center">
              {renderPaginationButtons()}
            </div>
            <div className="ml-4 text-sm text-blue-700">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-8">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Confirm User Deactivation</h3>
            <p className="text-blue-800 mb-6">
              Are you sure you want to deactivate user <strong>{userToDelete?.fullName}</strong> (ID: {userToDelete?.id})? 
            </p>
            <p className="text-sm text-blue-700 mb-6">
              This will mark the user as inactive but preserve all data. The user can be reactivated later if needed.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Deactivate User"}
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