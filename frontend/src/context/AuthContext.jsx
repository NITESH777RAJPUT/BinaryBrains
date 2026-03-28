import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("tracker_auth");
    return saved ? JSON.parse(saved) : { token: null, user: null };
  });

  useEffect(() => {
    localStorage.setItem("tracker_auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (payload) => {
    const data = await authService.login(payload);
    setAuth(data);
    return data;
  };

  const signup = async (payload) => {
    const data = await authService.signup(payload);
    setAuth(data);
    return data;
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("tracker_auth");
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

