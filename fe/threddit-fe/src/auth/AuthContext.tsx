// src/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../helpers/axiosInstance";

type Props = {
    children?: React.ReactNode
}

interface AuthContextProps {
  user: any;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }: Props) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get("/profile").then(response => {
      setUser(response.data);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await axiosInstance.post("/login", { username, password });
      const response = await axiosInstance.get("/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    // Clear user data and cookies
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
