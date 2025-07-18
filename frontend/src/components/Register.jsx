import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { postAPI } from '../utils/APIClient';
import { useAuth } from './AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('Freemium');
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const nav = useNavigate();
  const { login, accessToken, tokenType } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subscription = params.get('subscription');
    if (subscription) {
      setSubscriptionType(subscription);
    }
  }, [location.search]);

  const handleSubmit = (event) => {

    event.preventDefault();
    // Validation
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 8 || password.length > 16) {
      errors.password = 'Password must be between 8 and 16 characters';
    }
    if (Object.keys(errors).length === 0) {
      // Add registration logic here
      console.log('Registration submitted:', { username, email, password, subscriptionType });
      // After successful registration, redirect to login or home page
    } else {
      // Set errors state to display validation errors
      setErrors(errors);
    }

    const body = {
        username : username,
        email: email,
        password : password,
        subscription_type : subscriptionType
    }

    postAPI('auth/signup', body, accessToken, tokenType)
      .then((data) => {
        console.log("---------------", data)
        nav("/");
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  };

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username ? true : false}
          helperText={errors.username || ''}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
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
        <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
          <FormLabel component="legend">Subscription Type</FormLabel>
          <RadioGroup
            aria-label="subscriptionType"
            name="subscriptionType"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
            row
          >
            <FormControlLabel value="Freemium" control={<Radio />} label="Freemium" />
            <FormControlLabel value="Standard" control={<Radio />} label="Standard" />
            <FormControlLabel value="Premium" control={<Radio />} label="Premium" />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Register
        </Button>
        <Typography component="p" variant="body2" mt={2}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;