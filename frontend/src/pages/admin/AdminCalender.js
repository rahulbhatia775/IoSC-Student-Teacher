import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Grid,
    Chip,
    Alert,
    Snackbar,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CalendarToday,
    ChevronLeft,
    ChevronRight,
    Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import api from '../../api/axiosConfig';

const AdminCalendar = () => {
    // --- State and Logic (UNCHANGED) ---
    const [events, setEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({
        _id: '',
        date: '',
        type: 'Event',
        title: '',
        description: ''
    });
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, eventId: null });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        api.get("Calender/")
            .then(res => {
                setEvents(res.data.calender);
            })
            .catch(err => console.error(err));
    };

    const handleOpenDialog = (event = null) => {
        if (event) {
            setCurrentEvent(event);
            setEditMode(true);
        } else {
            setCurrentEvent({
                _id: '',
                date: '',
                type: 'Event',
                title: '',
                description: ''
            });
            setEditMode(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentEvent({
            _id: '',
            date: '',
            type: 'Event',
            title: '',
            description: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await api.put("Calender/" , {id : currentEvent._id , date : currentEvent.date , type : currentEvent.type , title : currentEvent.title , description : currentEvent.description})
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => console.error(err));
                fetchEvents();
            } else {
                const response = await api.post('Calender/', currentEvent);
                setEvents([...events, response.data]);
                showSnackbar('Event added successfully', 'success');
            }
            handleCloseDialog();
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            showSnackbar('Error saving event', 'error');

            if (editMode) {
                setEvents(events.map(e => e._id === currentEvent._id ? currentEvent : e));
            } else {
                const newEvent = { ...currentEvent, _id: Date.now().toString() };
                setEvents([...events, newEvent]);
            }
            handleCloseDialog();
            showSnackbar(editMode ? 'Event updated (demo)' : 'Event added (demo)', 'success');
        }
    };

    const handleDeleteClick = (eventId) => {
        setDeleteConfirm({ open: true, eventId });
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`Calender/${deleteConfirm.eventId}`);
            setEvents(events.filter(e => e._id !== deleteConfirm.eventId));
            showSnackbar('Event deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting event:', error);
            // For demo purposes
            setEvents(events.filter(e => e._id !== deleteConfirm.eventId));
            showSnackbar('Event deleted (demo)', 'success');
        }
        setDeleteConfirm({ open: false, eventId: null });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getEventsForDate = (dateStr) => {
        return events.filter(event => event.date === dateStr);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const renderMonthView = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            // Updated style for empty cells to match theme
            days.push(<Box key={`empty-${i}`} sx={{ p: 2, border: '1px solid', borderColor: 'rgba(0,0,0,0.1)' }} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const dayEvents = getEventsForDate(dateStr);
            const today = new Date();
            const isToday = formatDate(today) === dateStr;

            days.push(
                <Box
                    key={day}
                    sx={{
                        p: 1.5,
                        minHeight: '100px',
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.1)', // Light border
                        bgcolor: isToday ? '#e3f2fd' : 'background.paper', // Light blue background for today
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: isToday ? '#bbdefb' : 'grey.100', // Darker hover for today
                        },
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: isToday ? 'bold' : 'normal',
                            color: isToday ? '#0f2b6e' : 'text.primary', // Dark text for date number
                            mb: 0.5,
                        }}
                    >
                        {day}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {dayEvents.map((event) => (
                            <Chip
                                key={event._id}
                                label={event.title}
                                size="small"
                                // Use theme colors for chips
                                color={event.type === 'Holiday' ? 'error' : 'primary'}
                                sx={{
                                    fontSize: '0.7rem',
                                    height: '20px',
                                    backgroundColor: event.type === 'Holiday' ? '#e57373' : '#33A1FD', // Error/Primary shade
                                    color: 'white',
                                    fontWeight: 'bold',
                                    '& .MuiChip-label': {
                                        px: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            );
        }

        return days;
    };

    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    // --- End State and Logic (UNCHANGED) ---

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0f2b6e' }}>
                    Calendar Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        backgroundColor: '#2176FF', // Light Blue primary color
                        '&:hover': {
                            backgroundColor: '#0f2b6e', // Dark Blue hover
                        },
                        boxShadow: 2,
                    }}
                >
                    Add Event
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Calendar View */}
                <Grid item xs={12} lg={8}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, border: '1px solid #ddd' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <IconButton 
                                onClick={handlePrevMonth} 
                                sx={{ 
                                    bgcolor: '#2176FF', 
                                    color: 'white',
                                    '&:hover': { bgcolor: '#0f2b6e' }
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>

                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f2b6e' }}>
                                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </Typography>

                            <IconButton 
                                onClick={handleNextMonth} 
                                sx={{ 
                                    bgcolor: '#2176FF', 
                                    color: 'white',
                                    '&:hover': { bgcolor: '#0f2b6e' }
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
                            {daysOfWeek.map(day => (
                                <Typography
                                    key={day}
                                    variant="subtitle2"
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: '900',
                                        color: '#0f2b6e', // Dark blue for day headers
                                        py: 1,
                                        backgroundColor: '#e3f2fd', // Light background for headers
                                        borderRadius: 1,
                                    }}
                                >
                                    {day}
                                </Typography>
                            ))}
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                            {renderMonthView()}
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', gap: 3, justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: 'error.main', borderRadius: '50%' }} />
                                <Typography variant="caption" color="text.secondary">Holiday</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: '#2176FF', borderRadius: '50%' }} />
                                <Typography variant="caption" color="text.secondary">Event</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Events List */}
                <Grid item xs={12} lg={4}>
                    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, maxHeight: '800px', overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0f2b6e' }}>
                            All Events & Holidays
                        </Typography>

                        {sortedEvents.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <CalendarToday sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No events added yet. Click 'Add Event' to start.
                                </Typography>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {sortedEvents.map((event) => (
                                    <Card 
                                        key={event._id} 
                                        variant="outlined" 
                                        sx={{ 
                                            borderRadius: 2, 
                                            borderLeft: `5px solid ${event.type === 'Holiday' ? '#e57373' : '#2176FF'}`, 
                                            boxShadow: 1 
                                        }}
                                    >
                                        <CardContent sx={{ pb: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#0f2b6e' }}>
                                                    {event.title}
                                                </Typography>
                                                <Chip
                                                    label={event.type}
                                                    size="small"
                                                    color={event.type === 'Holiday' ? 'error' : 'primary'}
                                                    sx={{ 
                                                        backgroundColor: event.type === 'Holiday' ? '#e57373' : '#33A1FD',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                                <CalendarToday sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                                {new Date(event.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(event)}
                                                sx={{ color: '#2176FF' }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(event._id)}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 } // Rounded corners for dialog
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#0f2b6e', color: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {editMode ? 'Edit Event' : 'Add New Event'}
                    </Typography>
                    <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="Event Title"
                            name="title"
                            value={currentEvent.title}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            placeholder="e.g., Republic Day, Tech Fest"
                        />

                        <TextField
                            label="Date"
                            name="date"
                            type="date"
                            value={currentEvent.date}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={currentEvent.type}
                                onChange={handleInputChange}
                                label="Type"
                            >
                                <MenuItem value="Event">Event</MenuItem>
                                <MenuItem value="Holiday">Holiday</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Description"
                            name="description"
                            value={currentEvent.description}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            multiline
                            rows={3}
                            placeholder="Provide details about the event or holiday"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} sx={{ textTransform: 'none', color: '#0f2b6e' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!currentEvent.title || !currentEvent.date || !currentEvent.description}
                        sx={{ 
                            textTransform: 'none', 
                            px: 3, 
                            backgroundColor: '#2176FF',
                            '&:hover': { backgroundColor: '#0f2b6e' },
                        }}
                    >
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, eventId: null })}
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ bgcolor: 'error.dark', color: 'white' }}>Confirm Delete</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Typography>
                        Are you sure you want to delete this event? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteConfirm({ open: false, eventId: null })}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none' }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminCalendar;