import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { logoutUser } from '../redux/userRelated/userHandle';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Perform logout
        dispatch(logoutUser());
        
        // Redirect to home page after a short delay
        const timer = setTimeout(() => {
            navigate('/');
        }, 1500);

        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}
        >
            <CircularProgress color="inherit" size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
                Logging out...
            </Typography>
            <Typography variant="body1">
                Thank you for using our system!
            </Typography>
        </Box>
    );
};

export default Logout;