import { useState, useEffect } from 'react';
import { Trash2, Edit2, Shield, Search, Filter } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { apiService } from '../services/ApiServices';
import { confirm, CustomAlert } from '../components/DialogComponent';
import { Modal } from '../components/Modal';

const ManageUsers = ({ handleLogout }) => {
  const { userRole, hasRole } = useRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [alertState, setAlert] = useState({ show: false, message: '', type: '' });
  const [modalState, setModalState] = useState({ isOpen: false, user: null });
  const [selectedRole, setSelectedRole] = useState('viewer');

  useEffect(() => {
    if (!hasRole('admin')) {
      setAlert({
        show: true,
        message: 'You do not have permission to access this page',
        type: 'error'
      });
      return;
    }
    loadUsers();
  }, [hasRole]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      showAlert('Error loading users: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEditRole = (user) => {
    setModalState({ isOpen: true, user });
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (selectedRole === modalState.user.role) {
      setModalState({ isOpen: false, user: null });
      return;
    }

    try {
      await apiService.Role(modalState.user.id, selectedRole);
      setUsers(users.map(u =>
        u.id === modalState.user.id ? { ...u, role: selectedRole } : u
      ));
      setModalState({ isOpen: false, user: null });
      showAlert('User role updated to: ' + selectedRole, 'success');
    } catch (error) {
      console.error('Error updating role:', error);
      showAlert('Error updating user role: ' + error.message, 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = await confirm(`Delete user ${user.email}? This cannot be undone.`);
    if (confirmed) {
      try {
        await apiService.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
        showAlert('User deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        showAlert('Error deleting user: ' + error.message, 'error');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomAlert
        message={alertState.message}
        type={alertState.type}
        show={alertState.show}
        onClose={() => setAlert({ show: false, message: '', type: '' })}
      />


      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>
        

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">
                {searchTerm || filterRole !== 'all' ? 'No users match your filters' : 'No users found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_confirmed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.is_confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {
                            user.role === 'admin' ? null : 
                            <><button
                                onClick={() => handleEditRole(user)}
                                className="inline-flex items-center space-x-1 px-3 py-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Role"
                              >
                                <Edit2 size={16} />
                                <span className="text-xs">Edit</span>
                              </button><button
                                onClick={() => handleDeleteUser(user)}
                                className="inline-flex items-center space-x-1 px-3 py-1 rounded text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete User"
                              >
                                  <Trash2 size={16} />
                                  <span className="text-xs">Delete</span>
                                </button></>
                          }
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users
        </div>
      </main>

      {/* Edit Role Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, user: null })}
        title={`Update Role for ${modalState.user?.email}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield size={16} className="inline mr-2" />
              Select New Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="viewer">Viewer - Can only view data and stats</option>
              <option value="editor">Editor - Can create, edit, delete data</option>
              {/* <option value="admin">Admin - Full access including user management</option> */}
            </select>
            <p className="text-xs text-gray-500 mt-3">
              <strong>Current role:</strong> <span className="font-semibold capitalize">{modalState.user?.role}</span>
            </p>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-900">
              <strong>Note:</strong> The user must log out and log back in for role changes to take effect.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setModalState({ isOpen: false, user: null })}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRole}
              disabled={selectedRole === modalState.user?.role}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Update Role
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;