import api from '../../api/axiosConfig';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './noticeSlice';

// Get all notices (public)
export const getAllNotices = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        console.log('🔍 GET NOTICES DEBUG - Fetching notices for:', { id, address });
        
        // If no school ID provided, fetch all notices
        const endpoint = id ? `/${address}List/${id}` : `/${address}List`;
        console.log('🔍 GET NOTICES DEBUG - Using endpoint:', endpoint);
        
        const result = await api.get(endpoint);
        console.log('🔍 GET NOTICES DEBUG - Response:', result.data);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data.notices || result.data));
        }
    } catch (error) {
        console.error('🚨 GET NOTICES ERROR:', error);
        dispatch(getError(error.response?.data?.error || error.message));
    }
};

// Get all notices for students (no authentication required)
export const getPublicNotices = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await api.get('/NoticeList');
        if (result.data.success) {
            dispatch(getSuccess(result.data.notices));
        } else if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data || []));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.error || error.message));
    }
};

// Get teacher's notices (requires authentication)
export const getTeacherNotices = () => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await api.get('/TeacherNotices');
        
        if (result.data.success) {
            dispatch(getSuccess(result.data.notices));
        } else if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess([]));
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.error || error.message));
    }
};

// Create notice (teachers only)
export const createNotice = (noticeData) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await api.post('/NoticeCreate', noticeData);
        
        if (result.data.success) {
            return result.data;
        } else {
            throw new Error(result.data.message || 'Failed to create notice');
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.error || error.message));
        throw error;
    }
};

// Update notice (teachers only)
export const updateNotice = (noticeId, noticeData) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await api.put(`/Notice/${noticeId}`, noticeData);
        
        if (result.data.success) {
            return result.data;
        } else {
            throw new Error(result.data.message || 'Failed to update notice');
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.error || error.message));
        throw error;
    }
};

// Delete notice (teachers only)
export const deleteNotice = (noticeId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await api.delete(`/Notice/${noticeId}`);
        
        if (result.data.success) {
            return result.data;
        } else {
            throw new Error(result.data.message || 'Failed to delete notice');
        }
    } catch (error) {
        dispatch(getError(error.response?.data?.error || error.message));
        throw error;
    }
};