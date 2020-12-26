import React from "react";
import User from "../models/User";

const AuthContext = React.createContext<{
  user: User | null;
  setUser: (user: User | null, callback: () => void) => void;
}>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
