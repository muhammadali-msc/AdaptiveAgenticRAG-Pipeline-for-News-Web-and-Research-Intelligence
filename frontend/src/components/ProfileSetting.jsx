import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Stack, Divider } from '@mui/material';
import { postAPI, getAPI, putAPI } from '../utils/APIClient';
import { useAuth } from './AuthContext';

const ProfileSetting = () => {
  const { userId, username, email, accessToken, tokenType } = useAuth();
  const [formData, setFormData] = useState({
    username: username,
    email: email,
    current_password: '',
    new_password: '',
    subscription_type: 'Freemium',
    credit_count: 0,
  });
  const [view, setView] = useState('profile'); // 'profile' or 'subscription' or 'password'
  const [errors, setErrors] = useState({});

  useEffect(() => {
  getAPI(`subscription/getSubscription/?user_id=${userId}`, accessToken, tokenType)
    .then((data) => {
      setFormData(prevData => ({
        ...prevData,
        subscription_type: data['subscription_type'],
        credit_count: data['credits_count']
      }));
      console.log(data)
    })
    .catch((error) => {
      console.error('Error fetching subscription data:', error);
    });
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


  };

  const handleUpdatePassword = async () => {
    const body = {
          email : email,
          current_password : formData.current_password,
          update_password : formData.new_password
  }
  putAPI('auth/updatePassword', body, accessToken, tokenType)
   .then((data) => {
      alert(`Password Updated Successfully`);
      console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);
    });
  };

  const handleUpdateSubscription = async () => {
    const body = {
          user_id: userId,
          subscription_type: formData.subscription_type
    };

   putAPI('subscription/updateSubscription', body, accessToken, tokenType)
   .then((data) => {
    setFormData(prevData => ({
        ...prevData,
        subscription_type: data['subscription_type'],
        credit_count: data['credits_count']
      }));
      console.log(data)
      })
      .catch((error) => {
        console.error('Error:', error);

    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', backgroundColor: '#FFFFFF', padding: '20px' }}>
      {/* Left Side: Options */}
      <Box sx={{ width: '200px', borderRight: '1px solid #e0e0e0', padding: '20px' }}>
        <Typography variant="h6" gutterBottom onClick={() => setView('profile')} sx={{ cursor: 'pointer', marginBottom: '10px', backgroundColor: view === 'profile' ? '#e0e0e0' : 'inherit' }}>
          Profile
        </Typography>
        <Divider />
        <Typography variant="h6" gutterBottom onClick={() => setView('subscription')} sx={{ cursor: 'pointer', marginTop: '10px', backgroundColor: view === 'subscription' ? '#e0e0e0' : 'inherit' }}>
          Update Subscription
        </Typography>
        <Divider />
        <Typography variant="h6" gutterBottom onClick={() => setView('password')} sx={{ cursor: 'pointer', marginTop: '10px', backgroundColor: view === 'password' ? '#e0e0e0' : 'inherit' }}>
          Update Password
        </Typography>
      </Box>

      {/* Right Side: Profile or Subscription or Password Form */}
      <Box sx={{ flex: 1, padding: '20px' }}>

        {view === 'profile' && (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Typography variant="h6" gutterBottom sx={{ color: '#333', marginBottom: '20px' }}>
      Profile Details
    </Typography>
    <Box sx={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'left' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="subtitle1" sx={{ color: '#555' }}>
          Username:
        </Typography>
        <Typography variant="body1" sx={{ color: '#000' }}>
          {formData.username}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="subtitle1" sx={{ color: '#555' }}>
          Email:
        </Typography>
        <Typography variant="body1" sx={{ color: '#000' }}>
          {formData.email}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="subtitle1" sx={{ color: '#555' }}>
          Subscription Type:
        </Typography>
        <Typography variant="body1" sx={{ color: '#000' }}>
          {formData.subscription_type}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ color: '#555' }}>
          Credit Score:
        </Typography>
        <Typography variant="body1" sx={{ color: '#000' }}>
          {formData.credit_count}
        </Typography>
      </Box>
    </Box>
  </Box>
)}

        {view === 'subscription' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Update Subscription
            </Typography>
            <Stack spacing={2} mt={2}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Subscription Type</FormLabel>
                <RadioGroup
                  aria-label="subscriptionType"
                  name="subscription_type"
                  value={formData.subscription_type}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel value="Freemium" control={<Radio />} label="Freemium" />
                  <FormControlLabel value="Standard" control={<Radio />} label="Standard" />
                  <FormControlLabel value="Premium" control={<Radio />} label="Premium" />
                </RadioGroup>
              </FormControl>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Subscription Credit: {formData.credit_count}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleUpdateSubscription}>
                Update Subscription
              </Button>
            </Stack>
          </Box>
        )}

        {view === 'password' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Update Password
            </Typography>
            <Stack spacing={2} mt={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="current_password"
                label="Current Password"
                type="password"
                id="current_password"
                value={formData.current_password}
                onChange={handleChange}
                error={errors.current_password ? true : false}
                helperText={errors.current_password || ''}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="new_password"
                label="New Password"
                type="password"
                id="new_password"
                value={formData.new_password}
                onChange={handleChange}
                error={errors.new_password ? true : false}
                helperText={errors.new_password || ''}
              />
              <Button variant="contained" color="primary" onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileSetting;