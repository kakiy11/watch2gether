import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

interface UserData {
  username: string;
  email: string;
  avatar?: string;
  joinDate?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    defaultLanguage: string;
  };
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    joinDate: new Date().toLocaleDateString(),
    preferences: {
      theme: 'dark',
      notifications: true,
      defaultLanguage: 'English'
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData>(userData);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData(prev => ({ ...prev, ...parsed }));
      setEditedData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleSaveChanges = () => {
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(editedData));
    setUserData(editedData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result as string;
        setAvatarPreview(avatarUrl);
        setEditedData({ ...editedData, avatar: avatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate('/Main')}>
            ← Back to Main
          </button>
          <h1>Profile Settings</h1>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="avatar-container">
              {avatarPreview || userData.avatar ? (
                <img src={avatarPreview || userData.avatar} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  {userData.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            {isEditing && (
              <div className="avatar-upload">
                <label htmlFor="avatar-upload" className="upload-btn">
                  Change Avatar
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="profile-info-section">
            {!isEditing ? (
              <>
                <div className="info-row">
                  <label>Username:</label>
                  <span>{userData.username}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{userData.email}</span>
                </div>
                <div className="info-row">
                  <label>Member since:</label>
                  <span>{userData.joinDate}</span>
                </div>
                <div className="info-row">
                  <label>Default Language:</label>
                  <span>{userData.preferences?.defaultLanguage}</span>
                </div>
                <div className="info-row">
                  <label>Notifications:</label>
                  <span>{userData.preferences?.notifications ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="profile-actions">
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="info-row">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={editedData.username}
                    onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                    className="edit-input"
                  />
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editedData.email}
                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    className="edit-input"
                  />
                </div>
                <div className="info-row">
                  <label>Default Language:</label>
                  <select
                    value={editedData.preferences?.defaultLanguage}
                    onChange={(e) => setEditedData({
                      ...editedData,
                      preferences: { ...editedData.preferences!, defaultLanguage: e.target.value }
                    })}
                    className="edit-select"
                  >
                    <option>English</option>
                    <option>Russian</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="info-row">
                  <label>Notifications:</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={editedData.preferences?.notifications}
                      onChange={(e) => setEditedData({
                        ...editedData,
                        preferences: { ...editedData.preferences!, notifications: e.target.checked }
                      })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;