import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Box, IconButton, Typography, Card, CardContent, CardActions,
    Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, FormControl, InputLabel, Select, MenuItem, Grid,
    Alert, Snackbar, CircularProgress, Fab
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import api from '../../api/axiosConfig';

const TeacherNotices = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedNotice, setSelectedNotice] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [priority, setPriority] = useState('medium');
    const [formLoading, setFormLoading] = useState(false);

    // Snackbar states
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Using api instance with baseURL already configured

    // Get auth token
    const getAuthToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    // Fetch teacher's notices
    const fetchNotices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/TeacherNotices');
            
            if (response.data.success) {
                setNotices(response.data.notices);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch notices');
            showSnackbar('Failed to fetch notices', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.role === 'Teacher') {
            fetchNotices();
        }
    }, [currentUser]);

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Dialog handlers
    const openCreateDialog = () => {
        setDialogMode('create');
        setTitle('');
        setDetails('');
        setPriority('medium');
        setOpenDialog(true);
    };

    const openEditDialog = (notice) => {
        setDialogMode('edit');
        setSelectedNotice(notice);
        setTitle(notice.title);
        setDetails(notice.details);
        setPriority(notice.priority);
        setOpenDialog(true);
    };

    const openViewDialog = (notice) => {
        setDialogMode('view');
        setSelectedNotice(notice);
        setTitle(notice.title);
        setDetails(notice.details);
        setPriority(notice.priority);
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setSelectedNotice(null);
        setTitle('');
        setDetails('');
        setPriority('medium');
    };

    // CRUD operations
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !details.trim()) {
            showSnackbar('Title and details are required', 'error');
            return;
        }

        setFormLoading(true);
        try {
            const noticeData = { title, details, priority };

            if (dialogMode === 'create') {
                const response = await api.post('/NoticeCreate', noticeData);
                
                if (response.data.success) {
                    showSnackbar('Notice created successfully');
                    fetchNotices();
                    closeDialog();
                }
            } else if (dialogMode === 'edit') {
                const response = await api.put(`/Notice/${selectedNotice._id}`, noticeData);
                
                if (response.data.success) {
                    showSnackbar('Notice updated successfully');
                    fetchNotices();
                    closeDialog();
                }
            }
        } catch (err) {
            showSnackbar(err.response?.data?.error || 'Operation failed', 'error');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (noticeId) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;

        try {
            const response = await api.delete(`/Notice/${noticeId}`);
            
            if (response.data.success) {
                showSnackbar('Notice deleted successfully');
                fetchNotices();
            }
        } catch (err) {
            showSnackbar(err.response?.data?.error || 'Failed to delete notice', 'error');
        }
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    My Notices
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<NoteAddIcon />}
                    onClick={openCreateDialog}
                    sx={{
                        backgroundColor: '#270843',
                        '&:hover': { backgroundColor: '#3f1068' }
                    }}
                >
                    Create Notice
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {notices.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No notices found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Create your first notice to get started
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {notices.map((notice) => (
                        <Grid item xs={12} md={6} lg={4} key={notice._id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                        {notice.details.length > 100 
                                            ? `${notice.details.substring(0, 100)}...` 
                                            : notice.details
                                        }
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Created: {formatDate(notice.createdAt)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => openViewDialog(notice)}
                                        title="View"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => openEditDialog(notice)}
                                        title="Edit"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleDelete(notice._id)}
                                        title="Delete"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit/View Dialog */}
            <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'create' && 'Create New Notice'}
                    {dialogMode === 'edit' && 'Edit Notice'}
                    {dialogMode === 'view' && 'View Notice'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={dialogMode === 'view'}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            label="Details"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            disabled={dialogMode === 'view'}
                            sx={{ mb: 3 }}
                        />
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={priority}
                                label="Priority"
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={dialogMode === 'view'}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>
                        {dialogMode === 'view' ? 'Close' : 'Cancel'}
                    </Button>
                    {dialogMode !== 'view' && (
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={formLoading}
                            onClick={handleSubmit}
                            sx={{
                                backgroundColor: '#270843',
                                '&:hover': { backgroundColor: '#3f1068' }
                            }}
                        >
                            {dialogMode === 'create' ? 'Create' : 'Update'}
                        </LoadingButton>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TeacherNotices;