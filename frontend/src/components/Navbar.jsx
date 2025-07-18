import { Stack, Button} from "@mui/material";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { Logout } from "./";
import { useAuth } from './AuthContext';

function Navbar() {
    const { isLoggedIn } = useAuth();

    return (
        <Stack direction="row" alignItems="center" p={2} sx={{ position: "sticky", background: '#000', top: 0, justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="logo" height={45} />
          </Link>
          <Stack direction="row" spacing={2} alignItems="center">

            {isLoggedIn ? <Logout /> :
            <div>
            <Link to="/login" style={{ textDecoration: 'none', marginRight: '10px' }}>
               <Button
                className="login-btn"
                style={{
                  background: "#FC1503",
                  color: "white",

                }}
              >
               Login
              </Button>
            </Link>

            <Link to="/register" style={{ textDecoration: 'none', marginRight: '10px' }}>
               <Button
                className="register-btn"
                style={{
                  background: "#FC1503",
                  color: "white",
                }}
              >
                Register
              </Button>
            </Link>

            <Link to="/Overview" style={{ textDecoration: 'none', marginRight: '10px' }}>
               <Button
                className="Overview-btn"
                style={{
                  background: "#FC1503",
                  color: "white",

                }}
              >
               Overview
              </Button>
            </Link>

            </div>
            }
          </Stack>
        </Stack>
    )
};
export default Navbar;