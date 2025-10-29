import React from 'react';
import { useSelector } from 'react-redux';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    useTheme
} from '@mui/material';

const AdminProfile = () => {
    // Access MUI theme for colors and spacing
    const theme = useTheme();
    // Selector remains unchanged
    const { currentUser } = useSelector((state) => state.user);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            // Use responsive height
            minHeight="calc(100vh - 80px)" 
            padding={4}
            sx={{ 
                backgroundColor: theme.palette.grey[50], // Light background for content area
            }}
        >
            <Card
                sx={{
                    maxWidth: 500,
                    width: '100%',
                    padding: 4, // Increased padding for a spacious feel
                    borderRadius: 4, // Consistent large border radius
                    // Enhanced Shadow and Background
                    boxShadow: '0 8px 30px rgba(15, 43, 110, 0.15)', // Darker, deeper shadow
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'translateY(-3px)',
                    }
                }}
            >
                {/* --- Header Section (Gradient Background) --- */}
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    // Apply the signature gradient here
                    sx={{
                        background: 'linear-gradient(135deg, #0f2b6e 0%, #1b263b 100%)',
                        p: 4,
                        mt: -4, // Pull up to cover the top card padding
                        mx: -4, // Pull across to cover the side card padding
                        borderRadius: '4px 4px 0 0', // Sharp top corners, rounded bottom corners
                        mb: 3,
                    }}
                >
                    <Avatar 
                        sx={{ 
                            width: 100, // Larger Avatar
                            height: 100, 
                            mb: 2, 
                            // Gradient border effect
                            border: '4px solid #33A1FD',
                            bgcolor: '#2176FF', // Light blue background for the letter
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            boxShadow: '0 4px 15px rgba(33, 161, 253, 0.6)',
                        }}
                    >
                        {currentUser.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h4" fontWeight={700} color="white" sx={{ letterSpacing: 1 }}>
                        {currentUser.name}
                    </Typography>
                    <Typography variant="subtitle1" color="#bbeeff">
                        Admin
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3, borderColor: theme.palette.grey[300] }} />

                {/* --- Content Section --- */}
                <CardContent sx={{ p: 0 }}>
                    
                    {/* Email Field */}
                    <Box mb={3} sx={{
                        p: 2, 
                        borderRadius: 1, 
                        borderLeft: `5px solid #2176FF`, // Accent line
                        backgroundColor: theme.palette.grey[50] 
                    }}>
                        <Typography variant="body2" fontWeight={700} color="#0f2b6e">
                            Email
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ wordBreak: 'break-word' }}>
                            {currentUser.email}
                        </Typography>
                    </Box>

                    {/* School Field */}
                    <Box mb={1} sx={{
                        p: 2, 
                        borderRadius: 1, 
                        borderLeft: `5px solid #2176FF`, 
                        backgroundColor: theme.palette.grey[50] 
                    }}>
                        <Typography variant="body2" fontWeight={700} color="#0f2b6e">
                            School Name
                        </Typography>
                        <Typography variant="h6" color="text.primary">
                            {currentUser.schoolName}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminProfile;