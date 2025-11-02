import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, setGuestMode } from '../store/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      dispatch(loginStart());
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      dispatch(loginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
    } catch (error) {
      dispatch(loginFailure(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    dispatch(setGuestMode());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="weather-logo">
            <div className="sun"></div>
            <div className="cloud"></div>
          </div>
          <h1>WeatherSphere</h1>
          <p>Real time weather intelligence for South Asia</p>
        </div>
        
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">🌡️</span>
            <div>
              <div className="feature-title">Live Weather Data</div>
              <div className="feature-desc">60 second updates</div>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🗺️</span>
            <div>
              <div className="feature-title">Indian & Nepali Cities</div>
              <div className="feature-desc">12 major locations</div>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <div>
              <div className="feature-title">Personal Favorites</div>
              <div className="feature-desc">Save your preferred cities</div>
            </div>
          </div>
        </div>

        <div className="login-actions">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="google-login-btn"
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="google-logo"
                />
                Continue with Google
              </>
            )}
          </button>
          
          <div className="divider">
            <span>or</span>
          </div>

          <button
            onClick={handleGuestMode}
            className="guest-btn"
          >
            Continue as Guest
          </button>
        </div>
        
        <div className="login-footer">
          <p>Guest users can explore all features. Sign in to save favorites.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;