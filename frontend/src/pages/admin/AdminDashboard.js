import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    useTheme,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppBar, Drawer } from '../../components/styles';
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';

import AddStudent from './studentRelated/AddStudent';
import SeeComplains from './studentRelated/SeeComplains';
import ShowStudents from './studentRelated/ShowStudents';
import StudentAttendance from './studentRelated/StudentAttendance';
import StudentExamMarks from './studentRelated/StudentExamMarks';
import ViewStudent from './studentRelated/ViewStudent';

import AddNotice from './noticeRelated/AddNotice';
import ShowNotices from './noticeRelated/ShowNotices';

import ShowSubjects from './subjectRelated/ShowSubjects';
import SubjectForm from './subjectRelated/SubjectForm';
import ViewSubject from './subjectRelated/ViewSubject';

import AddTeacher from './teacherRelated/AddTeacher';
import ChooseClass from './teacherRelated/ChooseClass';
import ChooseSubject from './teacherRelated/ChooseSubject';
import ShowTeachers from './teacherRelated/ShowTeachers';
import TeacherDetails from './teacherRelated/TeacherDetails';

import AddClass from './classRelated/AddClass';
import ClassDetails from './classRelated/ClassDetails';
import ShowClasses from './classRelated/ShowClasses';
import AccountMenu from '../../components/AccountMenu';

import AdminTimeTable from './AdminTimeTable';
import AdminCalender from './AdminCalender';

const AdminDashboard = () => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            
            {/* App Bar */}
            <AppBar 
                open={open}
                sx={{
                    // Coordinated light background for contrast with the dark sidebar
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.background.default 
                        : '#e0e4e8', 
                    color: theme.palette.text.primary,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: 'fixed',
                    height: 64
                }}
            >
                <Toolbar sx={{ px: 3 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: 3,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ 
                            flexGrow: 1,
                            fontWeight: 600,
                            fontSize: '1.25rem',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
            
            {/* Sidebar (Drawer container) */}
            <Drawer 
                variant="permanent" 
                open={open}
                sx={{
                    borderRight: 'none',
                    // Background matching the sidebar gradient
                    backgroundColor: 'transparent',
                    background: "linear-gradient(135deg, #0d1b2a 80%, #1b263b 100%)",
                }}
            >
                {/* Toolbar inside Drawer */}
                <Toolbar sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: 2,
                    minHeight: '64px !important'
                }}>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Toolbar>
                <Divider sx={{ background: "#234" }} />
                <Box sx={{ overflow: 'auto' }}>
                    <SideBar open={open} />
                </Box>
            </Drawer>
            
            {/* Main Content */}
            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    // Very light background for main content area
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.background.default 
                        : '#f0f4f8', 
                    minHeight: '100vh',
                    pt: '80px'
                }}
            >
                <Routes>
                    <Route path="/" element={<AdminHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                    <Route path="/Admin/profile" element={<AdminProfile />} />
                    <Route path="/Admin/complains" element={<SeeComplains />} />

                    {/* Notice */}
                    <Route path="/Admin/addnotice" element={<AddNotice />} />
                    <Route path="/Admin/notices" element={<ShowNotices />} />

                    {/* Subject */}
                    <Route path="/Admin/subjects" element={<ShowSubjects />} />
                    <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                    <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />

                    <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                    <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />

                    <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                    {/* Class */}
                    <Route path="/Admin/addclass" element={<AddClass />} />
                    <Route path="/Admin/classes" element={<ShowClasses />} />
                    <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                    <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />

                    {/* Student */}
                    <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                    <Route path="/Admin/students" element={<ShowStudents />} />
                    <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                    <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                    <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />

                    {/* Teacher */}
                    <Route path="/Admin/teachers" element={<ShowTeachers />} />
                    <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                    <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                    <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                    <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                    <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />

                    {/* Time Table */}
                    <Route path='/Admin/timetable' element={<AdminTimeTable />} />
                    <Route path='/Admin/calender' element={<AdminCalender />} />

                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default AdminDashboard;