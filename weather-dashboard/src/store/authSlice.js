import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('weatherUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    isAuthenticated: !!loadUserFromStorage(),
    loading: false,
    error: null,
    isGuest: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isGuest = false;
      state.error = null;
      localStorage.setItem('weatherUser', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('weatherUser');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.error = null;
      localStorage.removeItem('weatherUser');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setGuestMode: (state) => {
      state.isGuest = true;
      state.isAuthenticated = true;
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearAuthError, setGuestMode } = authSlice.actions;
export default authSlice.reducer;