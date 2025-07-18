import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { postAPI } from '../utils/APIClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AddCategory() {
  const { login, accessToken, tokenType } = useAuth();
  const nav = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    const body = {
          category_name: categoryName
    };

    postAPI('user/addCategory', body, accessToken, tokenType)
  .then((data) => {
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
          Add Category
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="categoryName"
          label="Category Name"
          name="categoryName"
          autoFocus
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}>
          Add Category
        </Button>
      </Box>
    </Box>
  );
}

export default AddCategory;