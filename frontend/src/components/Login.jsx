import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { postAPI } from '../utils/APIClient'
import { useAuth } from './AuthContext';

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validation
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6 || password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters';
    }
    if (Object.keys(errors).length === 0) {
      // Add login logic here
      console.log('Login submitted:', { email, password });

        var formdata = new FormData();
//add three variable to form
        formdata.append("username", email);
        formdata.append("password", password);
        console.log(formdata)
        postAPI('auth/login', formdata)
          .then((data) => {
            console.log('POST request successful:', data, data['access_token'], data['token_type']);
            login(data['access_token'], data['token_type'], data['user_id'], data['username'], data['email'])
            nav('/')
          })
          .catch((error) => {
            console.error('Error:', error);
          });
              // After successful login, redirect to dashboard or home page
            } else {
              // Set errors state to display validation errors
              setErrors(errors);
            }
  };

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email ? true : false}
          helperText={errors.email || ''}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password ? true : false}
          helperText={errors.password || ''}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}>
          Login
        </Button>
        <Typography component="p" variant="body2" mt={2}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;