"use client" ;
import React from "react";
import { useState } from "react";
import Cookies from "universal-cookie";

export function useAuth() {
  const [auth, setAuth] = useState(null);
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  const cookies = new Cookies();

  const getVerifiedtoken = async () => {

    const token = cookies.get("token") ?? null;
    setAuth(token);
  };
  React.useEffect(() => {
    getVerifiedtoken();
  }, []);
  return { auth, username, setAuth, setUsername};
}