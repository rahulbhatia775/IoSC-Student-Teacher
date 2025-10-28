import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Popup from '../../../components/Popup';
import api from '../../../api/axiosConfig';

const AddNotice = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('medium');
  const [date, setDate] = useState('');

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    
    console.log('🔍 ADD NOTICE DEBUG - Starting submission');
    console.log('🔍 ADD NOTICE DEBUG - Current User:', currentUser);
    console.log('🔍 ADD NOTICE DEBUG - Token in localStorage:', localStorage.getItem('token'));
    
    if (!currentUser) {
      setMessage('Please login first');
      setShowPopup(true);
      return;
    }
    
    if (currentUser.role !== 'Admin') {
      setMessage('Only admins can add notices');
      setShowPopup(true);
      return;
    }
    
    if (!title.trim() || !details.trim() || !date) {
      setMessage('Please fill all required fields');
      setShowPopup(true);
      return;
    }
    
    setLoader(true);
    
    try {
      const noticeData = {
        title: title.trim(),
        details: details.trim(),
        priority,
        date,
        school: currentUser._id
      };
      
      console.log('🔍 ADD NOTICE DEBUG - Sending data:', noticeData);
      
      const response = await api.post('/NoticeCreate', noticeData);
      
      console.log('🔍 ADD NOTICE DEBUG - Response received:', response.data);
      
      if (response.data.success) {
        setMessage('Notice added successfully!');
        setShowPopup(true);
        
        // Reset form
        setTitle('');
        setDetails('');
        setPriority('medium');
        setDate('');
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate('/Admin/notices');
        }, 2000);
      } else {
        setMessage('Failed to add notice: ' + (response.data.error || 'Unknown error'));
        setShowPopup(true);
      }
    } catch (error) {
      console.error('🚨 ADD NOTICE ERROR:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Network error';
      setMessage('Error: ' + errorMessage);
      setShowPopup(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Add New Notice
        </Typography>
        <Box
          component="form"
          onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <TextField
            label="Title"
            fullWidth
            required
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Details"
            fullWidth
            required
            multiline
            rows={4}
            variant="outlined"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <TextField
            label="Priority"
            select
            fullWidth
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
          <TextField
            label="Date"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loader}
            sx={{
              backgroundColor: '#270843',
              '&:hover': { backgroundColor: '#3f1068' },
              mt: 1
            }}
          >
            Add Notice
          </LoadingButton>
        </Box>
      </Paper>



      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Container>
  );
};

export default AddNotice;
