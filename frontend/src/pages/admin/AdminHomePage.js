import { Container, Grid, Paper, Box, useTheme } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector(state => state.user);

    const [activeCard, setActiveCard] = useState(null);

    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    const cards = [
        {
            id: 'students',
            image: Students,
            alt: 'Students',
            title: 'Total Students',
            value: numberOfStudents,
            duration: 2.5,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
            id: 'classes',
            image: Classes,
            alt: 'Classes',
            title: 'Total Classes',
            value: numberOfClasses,
            duration: 2.5,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
            id: 'teachers',
            image: Teachers,
            alt: 'Teachers',
            title: 'Total Teachers',
            value: numberOfTeachers,
            duration: 2.5,
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        },
        {
            id: 'fees',
            image: Fees,
            alt: 'Fees',
            title: 'Fees Collection',
            value: 23000,
            duration: 2.5,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            prefix: '$',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
            <Grid container spacing={3}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.id}>
                        <StyledPaper
                            elevation={activeCard === card.id ? 8 : 2}
                            onClick={() => setActiveCard(card.id)}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                background: theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : '#ffffff',
                                border: activeCard === card.id 
                                    ? '2px solid #10b981' 
                                    : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: card.gradient,
                                    opacity: activeCard === card.id ? 1 : 0.7,
                                    transition: 'opacity 0.3s ease',
                                },
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 12px 24px rgba(0, 0, 0, 0.5)'
                                        : '0 12px 24px rgba(0, 0, 0, 0.15)',
                                    border: `1px solid ${card.color}`,
                                    '&::before': {
                                        opacity: 1,
                                    },
                                    '& .card-image': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                    },
                                    '& .card-title': {
                                        color: card.color,
                                    },
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '16px',
                                    background: theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <img 
                                    src={card.image} 
                                    alt={card.alt} 
                                    className="card-image"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </Box>
                            <Title 
                                className="card-title"
                                sx={{
                                    transition: 'color 0.3s ease',
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {card.title}
                            </Title>
                            <Data 
                                start={0} 
                                end={card.value} 
                                duration={card.duration}
                                prefix={card.prefix}
                                isActive={activeCard === card.id}
                                cardColor={card.color}
                            />
                        </StyledPaper>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 3, 
                            display: 'flex', 
                            flexDirection: 'column',
                            background: theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : '#ffffff',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 8px 16px rgba(0, 0, 0, 0.4)'
                                    : '0 8px 16px rgba(0, 0, 0, 0.1)',
                            }
                        }}
                    >
                        <SeeNotice />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const StyledPaper = styled(Paper)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 220px;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 12px !important;
`;

const Title = styled.p`
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
`;

const Data = styled(CountUp)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.isActive ? '#10b981' : props.cardColor};
  transition: color 0.3s ease;
  letter-spacing: -1px;
`;

export default AdminHomePage;