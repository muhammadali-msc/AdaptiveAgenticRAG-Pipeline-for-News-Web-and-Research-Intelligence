import { useState } from 'react';
import { Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Stack, Button } from '@mui/material';
import { Settings as SettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { getAPI } from '../utils/APIClient'
import { useAuth } from './AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Logout({ onLogout, profileImage }) {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const nav = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    console.log("Profile Settings clicked");
    // Add logic for profile settings action
    nav('/ProfileSetting')
    handleMenuClose();
  };

  const handleLogout = () => {
    getAPI(`auth/logout`)
      .then((data) => console.log(data.message))
        nav('/')
        logout()
    if (typeof onLogout === 'function') {
      onLogout();
    }
    handleMenuClose();
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Link to="/AddCategory" style={{ textDecoration: 'none', marginRight: '10px' }}>
           <Button
                className="addCategory-btn"
                style={{
                  background: location.pathname === '/AddCategory' ? "#FC1503" : "transparent",
                  color: location.pathname === '/AddCategory' ? "white" : "#FC1503",
                  border: "1px solid #FC1503",
                }}>
               Add Category
           </Button>
      </Link>

      <Link to="/AddNewPost" style={{ textDecoration: 'none', marginRight: '10px' }}>
           <Button
                className="addNewPost-btn"
                style={{
                  background: location.pathname === '/AddNewPost' ? "#FC1503" : "transparent",
                  color: location.pathname === '/AddNewPost' ? "white" : "#FC1503",
                  border: "1px solid #FC1503",
                }}>
               Add New Post
           </Button>
      </Link>

      <Link to="/AddAgenticAI" style={{ textDecoration: 'none', marginRight: '10px' }}>
           <Button
                className="addCohereLLMPost-btn"
                style={{
                  background: location.pathname === '/AddCohereLLMPost' ? "#FC1503" : "transparent",
                  color: location.pathname === '/AddCohereLLMPost' ? "white" : "#FC1503",
                  border: "1px solid #FC1503",
                }}>
               Add Cohere LLM Post
           </Button>
      </Link>

      <Avatar
        alt="Profile"
        src={profileImage}
        onClick={handleMenuOpen}
        sx={{ cursor: 'pointer', width: 32, height: 32 }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfileSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile Settings" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default Logout;