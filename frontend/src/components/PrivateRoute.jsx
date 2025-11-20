import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user?.user?.role !== 'admin') {
      navigate("/login");  // Yalnız useEffect daxilində çağırılır
    }
  }, [isAuthenticated, user, navigate]);  // Dependensiyalar dəyişdikdə işə düşür

  return children;
};

export default PrivateRoute;

