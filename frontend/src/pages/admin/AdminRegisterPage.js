import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, Typography, Paper, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import bgpic from "../../assets/designlogin.jpg";

const defaultTheme = createTheme();

const AdminRegisterPage = () => {
    const navigate = useNavigate();

    // Admin registration is disabled - redirect after showing message
    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2, color: "#d32f2f" }}>
                            Registration Disabled
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, color: "#666" }}>
                            Admin registration is not available.
                            <br />
                            Only students and teachers can register.
                            <br />
                            Admins are created by system administrators.
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999" }}>
                            Redirecting to home page in 3 seconds...
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Grid>
        </ThemeProvider>
    );
};

export default AdminRegisterPage;