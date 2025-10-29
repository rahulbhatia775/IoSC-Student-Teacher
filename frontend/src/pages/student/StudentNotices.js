import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Paper, Box, Typography, Card, CardContent, Grid,
    Alert, CircularProgress, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, TextField,
    InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import api from '../../api/axiosConfig';

const StudentNotices = () => {
    const { currentUser } = useSelector(state => state.user);

    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    // Using api instance with baseURL already configured

    // Fetch all notices
    const fetchNotices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/NoticeList');
            
            if (response.data.success) {
                setNotices(response.data.notices);
                setFilteredNotices(response.data.notices);
            } else {
                setNotices(response.data || []);
                setFilteredNotices(response.data || []);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch notices');
            console.error('Error fetching notices:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // Filter notices based on search term and priority
    useEffect(() => {
        let filtered = notices;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(notice =>
                notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                notice.details.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by priority
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(notice => notice.priority === priorityFilter);
        }

        setFilteredNotices(filtered);
    }, [notices, searchTerm, priorityFilter]);

    const openViewDialog = (notice) => {
        setSelectedNotice(notice);
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setSelectedNotice(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Notice Board
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Search and Filter Controls */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search notices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Priority Filter</InputLabel>
                            <Select
                                value={priorityFilter}
                                label="Priority Filter"
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">All Priorities</MenuItem>
                                <MenuItem value="high">High Priority</MenuItem>
                                <MenuItem value="medium">Medium Priority</MenuItem>
                                <MenuItem value="low">Low Priority</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                            {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''} found
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {filteredNotices.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        {searchTerm || priorityFilter !== 'all' ? 'No notices match your filters' : 'No notices available'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {searchTerm || priorityFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Check back later for new announcements'
                        }
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredNotices.map((notice) => (
                        <Grid item xs={12} md={6} lg={4} key={notice._id}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 4
                                    }
                                }}
                                onClick={() => openViewDialog(notice)}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                                            {notice.title}
                                        </Typography>
                                        <Chip 
                                            label={notice.priority.toUpperCase()} 
                                            color={getPriorityColor(notice.priority)}
                                            size="small"
                                        />
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                        {notice.details.length > 120 
                                            ? `${notice.details.substring(0, 120)}...` 
                                            : notice.details
                                        }
                                    </Typography>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="textSecondary">
                                            {notice.teacher?.name || 'Teacher'}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {formatDate(notice.createdAt)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* View Notice Dialog */}
            <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" component="span">
                            {selectedNotice?.title}
                        </Typography>
                        <Chip 
                            label={selectedNotice?.priority.toUpperCase()} 
                            color={getPriorityColor(selectedNotice?.priority)}
                            size="small"
                        />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                        {selectedNotice?.details}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                            <strong>Posted by:</strong> {selectedNotice?.teacher?.name || 'Teacher'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            <strong>Date:</strong> {selectedNotice && formatDate(selectedNotice.createdAt)}
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} startIcon={<VisibilityIcon />}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentNotices;