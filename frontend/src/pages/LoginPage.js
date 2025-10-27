import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  CssBaseline,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop,
  Modal
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import bgpic from "../assets/designlogin.jpg";
import { IndigoButton } from '../components/buttonStyles';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
import axios from 'axios';
import api from '../api/axiosConfig';

const defaultTheme = createTheme();

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, currentUser, response, currentRole } = useSelector(state => state.user);

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let hasError = false;

    if (!email) {
      setEmailError(true);
      hasError = true;
    } else setEmailError(false);

    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else setPasswordError(false);

    if (hasError) return;

    setLoader(true);
    setLoginError("");
    console.log('🔍 LOGINPAGE DEBUG - Calling loginUser with:', { email, password: '***', role });
    dispatch(loginUser({ email, password, role }));
  };

  const guestModeHandler = () => {
    const password = "zxc";
    let fields = {};
    if (role === "Admin") fields = { email: "yogendra@12", password, role };
    else if (role === "Student") fields = { email: "student@demo.com", password, role };
    else if (role === "Teacher") fields = { email: "tony@12", password, role };
    setGuestLoader(true);
    console.log('🔍 LOGINPAGE DEBUG - Guest login with:', { ...fields, password: '***' });
    dispatch(loginUser(fields));
  };

  const handleForgotPassword = async () => {
    console.log('🔍 FORGOT PASSWORD DEBUG - Step 1: Function called');
    console.log('🔍 FORGOT PASSWORD DEBUG - Step 2: Email:', forgotEmail, 'Role:', role);
    
    if (!forgotEmail) {
      console.log('🚨 FORGOT PASSWORD ERROR - No email provided');
      return;
    }
    
    setForgotLoading(true);
    try {
      let endpoint = '/StudentForgotPassword';
      if (role === 'Teacher') {
        endpoint = '/TeacherForgotPassword';
      } else if (role === 'Admin') {
        endpoint = '/AdminForgotPassword';
      }
      
      console.log('🔍 FORGOT PASSWORD DEBUG - Step 3: Using endpoint:', endpoint);
      console.log('🔍 FORGOT PASSWORD DEBUG - Step 4: Sending request with email:', forgotEmail);
      
      const response = await api.post(endpoint, { email: forgotEmail });
      
      console.log('🔍 FORGOT PASSWORD DEBUG - Step 5: Response received:', response.data);
      
      setMessage("🎉 New password sent to your email! Check your inbox and login with the new password.");
      setShowPopup(true);
      setForgotModalOpen(false);
      setForgotEmail("");
      
      console.log('🔍 FORGOT PASSWORD DEBUG - Step 6: Success - Modal closed and message shown');
    } catch (err) {
      console.error('🚨 FORGOT PASSWORD ERROR - Step 7: Error occurred:', err);
      console.error('🚨 FORGOT PASSWORD ERROR - Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setMessage(err.response?.data?.error || "Failed to send reset email");
      setShowPopup(true);
    } finally {
      setForgotLoading(false);
      console.log('🔍 FORGOT PASSWORD DEBUG - Step 8: Loading state reset');
    }
  };

  useEffect(() => {
    console.log('🔍 LOGINPAGE EFFECT - Status:', status, 'CurrentUser:', !!currentUser, 'CurrentRole:', currentRole);
    
    if (status === 'success' || currentUser !== null) {
      console.log('🔍 LOGINPAGE EFFECT - Login successful, redirecting to success page');
      setLoader(false);
      setGuestLoader(false);
      navigate('/login-success');
    } else if (status === 'failed') {
      console.log('🔍 LOGINPAGE EFFECT - Login failed:', response);
      setLoginError(response || "Login failed");
      setLoader(false);
      setGuestLoader(false);
    } else if (status === 'error') {
      console.log('🔍 LOGINPAGE EFFECT - Login error occurred');
      setLoginError("Network Error");
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2, color: "#2c2143" }}>{role} Login</Typography>
            <Typography variant="h7">Welcome back! Please enter your details</Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter your email"
                name="email"
                autoComplete="email"
                autoFocus
                error={emailError || !!loginError}
                helperText={emailError ? "Email is required" : ""}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(false); setLoginError(""); }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={toggle ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                error={passwordError || !!loginError}
                helperText={passwordError ? "Password is required" : loginError}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); setLoginError(""); }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setToggle(!toggle)}>
                        {toggle ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="text" onClick={() => setForgotModalOpen(true)}>Forgot password?</Button>
              </Grid>
              <IndigoButton type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                {loader ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </IndigoButton>
              <Button fullWidth onClick={guestModeHandler} variant="outlined" sx={{ mt: 2, mb: 3, color: "#1976d2", borderColor: "#1976d2" }}>Login as Guest</Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={false} sm={4} md={7} sx={{
          backgroundImage: `linear-gradient(rgba(25, 118, 210, 0.6), rgba(25, 118, 210, 0.6)), url(${bgpic})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1976d2',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: 4
        }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Empowering Education</Typography>
            <Typography variant="subtitle1">"Managing today for a smarter tomorrow — where every student matters."</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Forgot Password Modal */}
      <Modal open={forgotModalOpen} onClose={() => setForgotModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4
        }}>
          <Typography variant="h6" mb={2}>Forgot Password</Typography>
          <TextField
            fullWidth
            label="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <Button
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleForgotPassword}
            disabled={forgotLoading}
          >
            {forgotLoading ? <CircularProgress size={24} /> : "Send Reset Email"}
          </Button>
        </Box>
      </Modal>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={guestLoader}>
        <CircularProgress color="primary" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </ThemeProvider>
  );
};

export default LoginPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: rgb(49, 29, 205);
`;
