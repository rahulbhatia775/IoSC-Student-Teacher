import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, Button, Grid,
    Avatar, Chip, Paper, Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { underControl } from '../redux/userRelated/userSlice';

const defaultTheme = createTheme();

const LoginSuccess = () => {
    const { currentUser, currentRole } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any pending states
        dispatch(underControl());
        
        // Auto redirect after 3 seconds
        const timer = setTimeout(() => {
            redirectToDashboard();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const redirectToDashboard = () => {
        if (currentRole === 'Admin') navigate('/Admin/dashboard');
        else if (currentRole === 'Student') navigate('/Student/dashboard');
        else if (currentRole === 'Teacher') navigate('/Teacher/dashboard');
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return '#f57c00';
            case 'Teacher': return '#2e7d32';
            case 'Student': return '#1976d2';
            default: return '#666';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin': return '👨‍💼';
            case 'Teacher': return '👨‍🏫';
            case 'Student': return '👤';
            default: return '👤';
        }
    };

    if (!currentUser) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6">Redirecting...</Typography>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box 
                sx={{ 
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 3, boxShadow: 6 }}>
                    <CardContent sx={{ p: 4 }}>
                        {/* Success Header */}
                        <Box textAlign="center" mb={4}>
                            <Avatar 
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    bgcolor: getRoleColor(currentRole),
                                    fontSize: '2rem',
                                    mx: 'auto',
                                    mb: 2
                                }}
                            >
                                {getRoleIcon(currentRole)}
                            </Avatar>
                            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                Welcome Back!
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Login Successful
                            </Typography>
                        </Box>

                        {/* User Details */}
                        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Chip 
                                    label={currentRole}
                                    color="primary"
                                    sx={{ 
                                        bgcolor: getRoleColor(currentRole),
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Name:</strong> {currentUser.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Email:</strong> {currentUser.email}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {currentRole === 'Student' && (
                                    <>
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <ClassIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body1">
                                                    <strong>Class:</strong> {currentUser.sclassName}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body1">
                                                    <strong>Roll Number:</strong> {currentUser.rollNum}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </>
                                )}

                                {currentRole === 'Teacher' && (
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <ClassIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Teaching Class:</strong> {currentUser.teachSclass}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}

                                {currentRole === 'Admin' && (
                                    <Grid item xs={12}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>School:</strong> {currentUser.schoolName}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>

                        <Divider sx={{ my: 3 }} />

                        {/* Action Buttons */}
                        <Box textAlign="center">
                            <Typography variant="body2" color="textSecondary" mb={2}>
                                Redirecting to dashboard in 3 seconds...
                            </Typography>
                            
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<DashboardIcon />}
                                onClick={redirectToDashboard}
                                sx={{
                                    backgroundColor: getRoleColor(currentRole),
                                    '&:hover': { 
                                        backgroundColor: getRoleColor(currentRole),
                                        opacity: 0.9
                                    },
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Go to Dashboard
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default LoginSuccess;