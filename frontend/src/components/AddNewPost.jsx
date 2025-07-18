import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { postAPI, getAPI } from '../utils/APIClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AddNewPost() {
  const { accessToken, tokenType } = useAuth();
  const nav = useNavigate();
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories from your API
    getAPI('user/getCategory', accessToken, tokenType)
      .then((data) => {
        console.log(data);
        setCategories(data); // Assuming data is an array of categories
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [accessToken, tokenType]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!category.trim() || !summary.trim()) {
      setError('Category and Summary are required');
      return;
    }

    const body = {
      text: summary,
      category: category
    };

    postAPI('user/create', body, accessToken, tokenType)
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
          Add New AgenticAI
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((categoryItem) => (
              <MenuItem key={categoryItem.id} value={categoryItem.category_name}>
                {categoryItem.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="summary"
          label="Summary"
          name="summary"
          multiline
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          error={!!error}
          helperText={error}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Add AgenticAI
        </Button>
      </Box>
    </Box>
  );
}

export default AddNewPost;