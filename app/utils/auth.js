  import { useState, useEffect } from 'react';
  import Cookies from 'js-cookie';
  import API from '../utils/api';


  export function useAuth() {
    const [auth, setAuth] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
      // Check for token and email in cookies
      const token = Cookies.get('token');
      const userEmail = null;
      
      if (token) {
        setAuth(token);
      } else {
        
        setAuth(null);
      }

      if (userEmail) {
        setEmail(userEmail);
      } else {
        setEmail(null);
      }
    }, []);

    const login = (newToken, userEmail) => {
      setAuth(newToken);
      setEmail(userEmail);
      console.log("From useAuth " + newToken + userEmail);
    };

    const logout = () => {
      setAuth(null);
      setEmail(null);
    };

    return { auth, email, login, logout };
  }
