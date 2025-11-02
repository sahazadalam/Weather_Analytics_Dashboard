import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { setAutoRefresh, setRefreshInterval } from '../store/weatherSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isGuest } = useSelector(state => state.auth);
  const { autoRefresh, refreshInterval } = useSelector(state => state.weather);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (!isGuest) {
        await signOut(auth);
      }
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAutoRefreshToggle = () => {
    dispatch(setAutoRefresh(!autoRefresh));
  };

  const handleIntervalChange = (interval) => {
    dispatch(setRefreshInterval(interval));
  };

  return (
    <div className="user-profile">
      <div 
        className="user-avatar"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {user && user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName || 'User'}
            className="user-photo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`guest-avatar ${user && user.photoURL ? 'hidden' : ''}`}>
          👤
        </div>
        <span className="user-name">
          {user ? (user.displayName || 'User') : 'Guest'}
        </span>
        <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
      </div>

      {isDropdownOpen && (
        <div className="user-dropdown">
          {user && (
            <div className="user-info-section">
              <div className="user-email">{user.email}</div>
              <div className="user-status">Signed in with Google</div>
            </div>
          )}
          
          {isGuest && (
            <div className="guest-notice">
              <span className="guest-icon">👤</span>
              You're browsing as guest
            </div>
          )}

          <div className="dropdown-section">
            <h4>Auto Refresh</h4>
            <div className="setting-row">
              <span>Update every {refreshInterval/1000}s</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={autoRefresh}
                  onChange={handleAutoRefreshToggle}
                />
                <label htmlFor="auto-refresh" className="toggle-slider"></label>
              </div>
            </div>
          </div>

          <div className="dropdown-section">
            <h4>Refresh Interval</h4>
            <div className="interval-buttons">
              {[15000, 30000, 60000].map(interval => (
                <button
                  key={interval}
                  className={`interval-btn ${refreshInterval === interval ? 'active' : ''}`}
                  onClick={() => handleIntervalChange(interval)}
                >
                  {interval / 1000}s
                </button>
              ))}
            </div>
          </div>

          <div className="dropdown-section">
            <button
              onClick={handleLogout}
              className={`logout-btn ${isGuest ? 'guest-logout' : ''}`}
            >
              <span className="logout-icon">{isGuest ? '🚪' : '🔓'}</span>
              {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;