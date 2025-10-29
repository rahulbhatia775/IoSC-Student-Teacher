import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices } from '../redux/noticeRelated/noticeHandle';
import { Paper } from '@mui/material';
import TableViewTemplate from './TableViewTemplate';

const SeeNotice = () => {
    const dispatch = useDispatch();

    const { currentUser, currentRole } = useSelector(state => state.user);
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('🔍 SEE NOTICE DEBUG - Current User:', currentUser);
            console.log('🔍 SEE NOTICE DEBUG - Current Role:', currentRole);
        }
        
        if (currentUser && currentRole === "Admin") {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 SEE NOTICE DEBUG - Admin: fetching notices for admin ID:', currentUser._id);
            }
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
        else if (currentUser) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 SEE NOTICE DEBUG - Student/Teacher: fetching all notices');
            }
            // For students and teachers, fetch all notices (no school filtering for now)
            dispatch(getAllNotices(null, "Notice"));
        } else {
            console.log('🚨 SEE NOTICE ERROR - No current user');
        }
    }, [dispatch, currentUser, currentRole]);

    if (error) {
        console.log(error);
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

<<<<<<< HEAD
    const noticeRows = Array.isArray(noticesList) ? noticesList.map((notice) => {
=======
    // RIGHT (Checks if noticesList is an array first)
    const noticeRows = Array.isArray(noticesList)
    ? noticesList.map((notice) => {
        // ... (rest of your map logic) ...
>>>>>>> 3e0eaca9b773d432e0e11daee5d48e6be8b71e1b
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
<<<<<<< HEAD
    }) : [];
=======
        })
    : []; // <-- If not an array, default to an empty array
>>>>>>> 3e0eaca9b773d432e0e11daee5d48e6be8b71e1b
    return (
        <div style={{ marginTop: '50px', marginRight: '20px' }}>
            {loading ? (
                <div style={{ fontSize: '20px' }}>Loading...</div>
            ) : response ? (
                <div style={{ fontSize: '20px' }}>No Notices to Show Right Now</div>
            ) : (
                <>
                    <h3 style={{ fontSize: '30px', marginBottom: '40px' }}>Notices</h3>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {Array.isArray(noticesList) && noticesList.length > 0 &&
                            <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
                        }
                    </Paper>
                </>
            )}
        </div>

    )
}

export default SeeNotice