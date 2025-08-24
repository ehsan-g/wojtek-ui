// src/components/PrivateRoute.js
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
