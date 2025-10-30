import * as React from 'react';
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Box,
  Typography
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

// Icon Imports (truncated for brevity)
import HomeIcon from "@mui/icons-material/Home";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const menuItems = [
  { to: "/", label: "Home", icon: <HomeIcon />, match: (p) => p === "/" || p === "/Admin/dashboard" },
  { to: "/Admin/classes", label: "Classes", icon: <ClassOutlinedIcon />, match: (p) => p.startsWith('/Admin/classes') },
  { to: "/Admin/subjects", label: "Subjects", icon: <AssignmentIcon />, match: (p) => p.startsWith('/Admin/subjects') },
  { to: "/Admin/teachers", label: "Teachers", icon: <SupervisorAccountOutlinedIcon />, match: (p) => p.startsWith('/Admin/teachers') },
  { to: "/Admin/students", label: "Students", icon: <PersonOutlineIcon />, match: (p) => p.startsWith('/Admin/students') },
  { to: "/Admin/timetable", label: "TimeTable", icon: <CalendarMonthIcon />, match: (p) => p.startsWith('/Admin/timetable') },
  { to: "/Admin/calender", label: "Year Calender", icon: <EventAvailableIcon />, match: (p) => p.startsWith('/Admin/calender') },
  { to: "/Admin/notices", label: "Notices", icon: <AnnouncementOutlinedIcon />, match: (p) => p.startsWith('/Admin/notices') },
  { to: "/Admin/complains", label: "Complains", icon: <ReportIcon />, match: (p) => p.startsWith('/Admin/complains') },
];

const userItems = [
  { to: "/Admin/profile", label: "Profile", icon: <AccountCircleOutlinedIcon />, match: (p) => p.startsWith('/Admin/profile') },
  { to: "/logout", label: "Logout", icon: <ExitToAppIcon />, match: (p) => p.startsWith('/logout') },
];

const iconWrapperStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.3s, box-shadow 0.3s',
};

// Branding Component (FIXED for enclosure)
const Branding = () => (
    <Box
        sx={{
            width: '100%',
            px: 3,
            py: 2,
            mb: 1,
            bgcolor: 'transparent',
            background: "linear-gradient(135deg, #0d1b2a 80%, #1b263b 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.09)",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: { xs: 80, sm: 120 }, 
            overflow: 'hidden', // Ensure nothing leaks out of this box
        }}
    >
        <Typography
            variant="h4"
            // Use component="div" to ensure a block container for line breaking
            component="div" 
            sx={{
                fontWeight: 900,
                fontSize: { xs: '1.2rem', sm: '2.2rem' }, 
                letterSpacing: 1,
                background: 'linear-gradient(90deg, #2176FF, #33A1FD)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                mt: 1,
                textShadow: '0 2px 16px rgba(60,95,200,0.16)',
                // Ensure text can wrap if needed, overriding any potential nowrap defaults
                whiteSpace: 'normal', 
            }}
        >
            USAR Samvad
        </Typography>
        <Typography
            variant="subtitle2"
            sx={{
                color: '#fff',
                fontWeight: 400,
                fontSize: { xs: '0.8rem', sm: '0.95rem' }, 
                opacity: 0.78,
                letterSpacing: 2,
                mb: 1,
            }}
        >
            powered by IoSC EDC
        </Typography>
    </Box>
);

const SideBar = ({ open }) => {
  const location = useLocation();

  const renderListItem = (item) => {
    const active = item.match(location.pathname);
    return (
        <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            sx={{
                my: 0.8,
                borderRadius: 2,
                px: open ? 2 : 0, 
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                transition: 'padding 0.3s, background-color 0.3s',
                
                '&:hover': {
                    backgroundColor: 'rgba(41,128,185, 0.15)',
                },
                backgroundColor: active ? 'rgba(41,128,185, 0.1)' : 'transparent',
            }}
        >
            <ListItemIcon
                sx={{
                    ...iconWrapperStyle,
                    background: active ? 'rgba(41,128,185, 0.3)' : 'transparent',
                    color: active ? 'primary.main' : '#fff',
                    minWidth: 0,
                    mr: open ? 3 : 'auto', 
                    justifyContent: 'center',
                }}
            >
                {React.cloneElement(item.icon, { color: active ? 'primary' : 'inherit' })}
            </ListItemIcon>
            <ListItemText
                primary={item.label}
                sx={{
                    color: active ? 'primary.main' : '#fff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: open ? 'block' : 'none', 
                }}
            />
        </ListItemButton>
    );
  };

  return (
    <Box
      sx={{
        // --- CHANGE APPLIED HERE ---
        // Setting minHeight to '100vh' ensures the background fills the entire screen height, 
        // which helps resolve coloring issues on mobile devices.
        minHeight: "100vh", 
        py: 0, 
        background: "linear-gradient(135deg, #0d1b2a 80%, #1b263b 100%)",
        color: "#fff",
        width: "100%",
      }}
    >
      {/* --- Branding Section --- */}
      {open && <Branding />}

      {/* Divider below branding */}
      {open && <Divider sx={{ my: 1, background: "#234" }} />}

      {/* --- Main Navigation Items --- */}
      <Box sx={{ px: open ? 1 : 0.5, pt: 1 }}>
        {menuItems.map(renderListItem)}
      </Box>

      <Divider sx={{ my: 2, mx: open ? 1 : 0.5, background: "#234" }} />

      {/* --- User Section --- */}
      {open && ( 
        <ListSubheader
          component="div"
          inset
          sx={{
            background: 'transparent',
            color: "#bbb",
            fontWeight: 'bold',
            letterSpacing: 1,
            mb: 1,
            px: 2.5
          }}
        >
          User
        </ListSubheader>
      )}
      <Box sx={{ px: open ? 1 : 0.5, pb: 2 }}>
        {userItems.map(renderListItem)}
      </Box>
    </Box>
  );
};

export default SideBar;