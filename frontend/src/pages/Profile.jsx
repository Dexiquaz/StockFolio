import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const Profile = () => {
  const getAuthHeader = useAuthStore((state) => state.getAuthHeader);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: '', currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: getAuthHeader(),
      });
      setProfile(res.data.user);
      setForm((prev) => ({ ...prev, email: res.data.user.email }));
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const updateData = {};
      if (form.email !== profile.email) updateData.email = form.email;
      if (form.newPassword) {
        updateData.currentPassword = form.currentPassword;
        updateData.newPassword = form.newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save.');
        return;
      }

      await axios.put('/api/auth/profile', updateData, {
        headers: getAuthHeader(),
      });

      setMessage('Profile updated successfully.');
      setEditing(false);
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-white p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {!editing ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'N/A'}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full mt-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder="Required to change password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError('');
                    setForm({ email: profile.email, currentPassword: '', newPassword: '' });
                  }}
                  className="flex-1 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
