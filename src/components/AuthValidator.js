import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosInstance'; // your custom axios instance
import PropTypes from 'prop-types';

import { setUserFromToken, logout } from '../redux/slices/authSlice';

const AuthValidator = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userInfo');

    if (token) {
      axios
        .get('/auth/me')
        .then(() => {
          dispatch(setUserFromToken(token));
          setLoading(false);
        })
        .catch(() => {
          dispatch(logout());
          navigate('/login');
        });
    } else {
      dispatch(logout());
      navigate('/login');
    }
  }, [dispatch, navigate]); // ✅ FIXED: add dispatch & navigate here

  if (loading) {
    return <div>Loading...</div>; // replace with a spinner if you want
  }

  return children;
};

AuthValidator.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthValidator;
