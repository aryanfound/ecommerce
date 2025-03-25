import React from "react";
import { useState, createContext, useContext } from "react";

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authorize, setAuthorize] = useState(false);
  const [verification, setVerification] = useState(false);

  return (
    <AuthContext.Provider value={{ authorize, setAuthorize, verification, setVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuthFile() {
    
      return useContext(AuthContext);
}

export default AuthContext;