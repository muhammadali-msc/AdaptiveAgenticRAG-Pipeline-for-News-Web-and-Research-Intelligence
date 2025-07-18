import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { postAPI, getAPI } from '../utils/APIClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';

function AddAgenticAI() {
  const { accessToken, tokenType } = useAuth();
  const nav = useNavigate();
  const messagesEndRef = useRef(null);

  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    getAPI('user/getCategory', accessToken, tokenType)
      .then((data) => setCategories(data))
      .catch(() => showSnackbar('Failed to load categories', 'error'));
  }, [accessToken, tokenType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const showSnackbar = (message, severity = 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = {
      type: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setConversation((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const body = { question: userMessage.text };
      const data = await postAPI('agenticragai/agenticworkflow/', body, accessToken, tokenType);
      const botText = data?.answer?.generation || 'No response received.';
      const botMessage = {
        type: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setConversation((prev) => [...prev, botMessage]);
    } catch {
      showSnackbar('Something went wrong while fetching response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const lastBotMessage = conversation.findLast((msg) => msg.type === 'bot');
    if (!category || !lastBotMessage) {
      showSnackbar('Select a category and generate a post before publishing');
      return;
    }

    const body = {
      text: lastBotMessage.text,
      category: category,
    };

    postAPI('user/create', body, accessToken, tokenType)
      .then(() => {
        showSnackbar('Post published!', 'success');
        nav('/');
      })
      .catch(() => showSnackbar('Failed to publish post.'));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2, bgcolor: '#f5f5f5' }}>
        {conversation.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 1.5,
            }}
          >
            {msg.type === 'bot' && <Avatar sx={{ bgcolor: '#000', mr: 1 }}>🤖</Avatar>}
            <Paper
              elevation={2}
              sx={{
                p: 1.5,
                maxWidth: '70%',
                borderRadius: '18px',
                bgcolor: msg.type === 'user' ? '#DCF8C6' : 'white',
                whiteSpace: 'pre-wrap',
              }}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {children}
                    </Typography>
                  ),
                  strong: ({ children }) => (
                    <Typography component="span" fontWeight="bold">
                      {children}
                    </Typography>
                  ),
                  em: ({ children }) => (
                    <Typography component="span" fontStyle="italic">
                      {children}
                    </Typography>
                  ),
                  li: ({ children }) => (
                    <li>
                      <Typography component="span" variant="body2">
                        {children}
                      </Typography>
                    </li>
                  ),
                  code: ({ children }) => (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: '#eee',
                        px: 0.5,
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                      }}
                    >
                      {children}
                    </Box>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <Typography
                variant="caption"
                sx={{ mt: 0.5, display: 'block', textAlign: 'right', color: '#888' }}
              >
                {msg.timestamp}
              </Typography>
            </Paper>
            {msg.type === 'user' && <Avatar sx={{ bgcolor: '#1976d2', ml: 1 }}>🙋‍♂️</Avatar>}
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          px: 2,
          py: 1,
          borderTop: '1px solid #ccc',
          bgcolor: 'white',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          multiline
          maxRows={3}
          variant="outlined"
        />
        <Button variant="contained" type="submit" disabled={isLoading}>
          Send
        </Button>
      </Box>

      {/* Category + Save */}
      {conversation.find((msg) => msg.type === 'bot') && (
        <Box sx={{ px: 2, py: 2, borderTop: '1px solid #eee', bgcolor: '#fafafa' }}>
          <FormControl fullWidth>
            <InputLabel id="category-label">Select Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Select Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            sx={{ mt: 2 }}
            variant="contained"
            color="success"
            disabled={!category}
            onClick={handleSave}
          >
            📤 Publish Post
          </Button>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddAgenticAI;
