import { atom } from 'nanostores';

export const authStore = atom({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user')) || null,
});

if (process.env.NODE_ENV === 'development') {
  window.authStore = authStore;
}

export const login = (userData) => {
  authStore.set({ isAuthenticated: true, user: userData });
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', JSON.stringify(userData));
};

export const logout = () => {
  authStore.set({ isAuthenticated: false, user: null });
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
};

export const register = async (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((user) => user.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const updatedUsers = [...users, userData];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    await login({
      email: userData.email,
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find(
    (user) => user.email === email && user.password === password
  );
};
