import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar, 
    Typography,
    useTheme,
    IconButton,
    useMediaQuery, 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, Route, Routes } from 'react-router-dom';

// Assumed styled components from local path
import { AppBar, Drawer } from '../../components/styles';

// Component Imports (truncated for brevity)
import Logout from '../Logout';
import SideBar from './SideBar';
import AdminProfile from './AdminProfile';
import AdminHomePage from './AdminHomePage';
import AccountMenu from '../../components/AccountMenu';
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
import AdminTimeTable from './AdminTimeTable';
import AdminCalender from './AdminCalender';


const drawerWidth = 260;
const collapsedDrawerWidth = 75;

// Empty component for fixed spacing below the AppBar
const AppBarSpacer = () => {
    const theme = useTheme();
    // Use the official mixins toolbar height for spacing
    return <Box sx={theme.mixins.toolbar} />;
};


const AdminDashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
    
    // Set initial state: open on large screens, closed on mobile screens
    const [open, setOpen] = useState(!isMobile); 

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const drawerVariant = isMobile ? 'temporary' : 'permanent';

    const handleDrawerClose = () => {
        if (isMobile) {
            setOpen(false);
        }
    };


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* === 1. App Bar (Header) === */}
            <AppBar
                position="fixed" 
                open={open}
                sx={{
                    background: "linear-gradient(90deg, #0f2b6e 80%, #1b263b 100%)",
                    boxShadow: '0 2px 16px rgba(8, 34, 75, 0.14)',
                    borderBottom: '1px solid rgba(255,255,255,0.09)',
                    zIndex: theme.zIndex.drawer + 1,
                    height: 64,
                    width: {
                        sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
                        xs: '100%',
                    },
                    marginLeft: {
                         sm: open ? drawerWidth : collapsedDrawerWidth,
                         xs: 0,
                    },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar sx={{ px: 3, width: '100%' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: 3,
                            display: open && !isMobile ? 'none' : 'flex',
                            color: '#fff'
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.3rem' }, color: "#fff" }}
                    >
                        Admin Dashboard
                    </Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>

            {/* === 2. Sidebar (Drawer) === */}
            <Drawer
                variant={drawerVariant} 
                open={open}
                onClose={handleDrawerClose} 
                ModalProps={{ 
                    keepMounted: true, 
                }}
                sx={{
                    width: isMobile ? drawerWidth : (open ? drawerWidth : collapsedDrawerWidth),
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        // FIX: Explicitly set position to 'fixed' for non-mobile permanent drawer
                        position: isMobile ? 'absolute' : 'fixed', 
                        width: isMobile ? drawerWidth : (open ? drawerWidth : collapsedDrawerWidth),
                        boxSizing: 'border-box',
                        background: "linear-gradient(135deg, #0d1b2a 80%, #1b263b 100%)",
                        color: "#fff",
                        borderRight: 0,
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        pt: 0,
                        minHeight: '100vh', 
                    }
                }}
            >
                {/* Drawer Toggle Icon */}
                <Toolbar sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: 2,
                    minHeight: '64px !important',
                }}>
                    <IconButton onClick={toggleDrawer} sx={{ 
                         color: 'primary.main',
                         display: isMobile || open ? 'flex' : 'none', 
                    }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>

                {/* Sidebar Content (including branding) */}
                <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    <SideBar open={open} />
                </Box>
            </Drawer>

            {/* === 3. Main Content Area === */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, sm: 3 }, 
                    backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.background.default 
                        : '#f9fafb',
                    minHeight: '100vh',
                    width: '100%', 
                    // This padding is now redundant because of AppBarSpacer, but keeping 
                    // the Box structure clean for content overflow
                }}
            >
                {/* Spacer to push content down below the fixed AppBar */}
                <AppBarSpacer /> 
                
                <Routes>
                    <Route path="/" element={<AdminHomePage />} />
                    <Route path='*' element={<Navigate to="/" />} />
                    <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                    <Route path="/Admin/profile" element={<AdminProfile />} />
                    <Route path="/Admin/complains" element={<SeeComplains />} />
                    <Route path="/Admin/addnotice" element={<AddNotice />} />
                    <Route path="/Admin/notices" element={<ShowNotices />} />
                    <Route path="/Admin/subjects" element={<ShowSubjects />} />
                    <Route path="/Admin/subjects/subject/:classID/:subjectID" element={<ViewSubject />} />
                    <Route path="/Admin/subjects/chooseclass" element={<ChooseClass situation="Subject" />} />
                    <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                    <Route path="/Admin/class/subject/:classID/:subjectID" element={<ViewSubject />} />
                    <Route path="/Admin/subject/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Admin/subject/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                    <Route path="/Admin/addclass" element={<AddClass />} />
                    <Route path="/Admin/classes" element={<ShowClasses />} />
                    <Route path="/Admin/classes/class/:id" element={<ClassDetails />} />
                    <Route path="/Admin/class/addstudents/:id" element={<AddStudent situation="Class" />} />
                    <Route path="/Admin/addstudents" element={<AddStudent situation="Student" />} />
                    <Route path="/Admin/students" element={<ShowStudents />} />
                    <Route path="/Admin/students/student/:id" element={<ViewStudent />} />
                    <Route path="/Admin/students/student/attendance/:id" element={<StudentAttendance situation="Student" />} />
                    <Route path="/Admin/students/student/marks/:id" element={<StudentExamMarks situation="Student" />} />
                    <Route path="/Admin/teachers" element={<ShowTeachers />} />
                    <Route path="/Admin/teachers/teacher/:id" element={<TeacherDetails />} />
                    <Route path="/Admin/teachers/chooseclass" element={<ChooseClass situation="Teacher" />} />
                    <Route path="/Admin/teachers/choosesubject/:id" element={<ChooseSubject situation="Norm" />} />
                    <Route path="/Admin/teachers/choosesubject/:classID/:teacherID" element={<ChooseSubject situation="Teacher" />} />
                    <Route path="/Admin/teachers/addteacher/:id" element={<AddTeacher />} />
                    <Route path='/Admin/timetable' element={<AdminTimeTable />} />
                    <Route path='/Admin/calender' element={<AdminCalender />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default AdminDashboard;