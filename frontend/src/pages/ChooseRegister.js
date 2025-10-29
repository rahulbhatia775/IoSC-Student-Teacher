import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { School, Group } from '@mui/icons-material';
import styled from 'styled-components';

const ChooseRegister = () => {
  const navigate = useNavigate();

  const navigateHandler = (user) => {
    if (user === 'Student') {
      navigate('/Studentregister');
    } else if (user === 'Teacher') {
      navigate('/Teacherregister');
    }
  };

  return (
    <StyledContainer>
      <Container>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <StyledTitle>
              Choose Your Registration Type
            </StyledTitle>
            <StyledSubtitle>
              Select whether you want to register as a student or teacher
            </StyledSubtitle>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper onClick={() => navigateHandler('Student')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Group sx={{ fontSize: 80, color: '#7f56da', mb: 2 }} />
                <StyledTypography>Student</StyledTypography>
                <StyledDescription>
                  Register as a student to access courses, assignments, and track your academic progress
                </StyledDescription>
              </Box>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StyledPaper onClick={() => navigateHandler('Teacher')}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <School sx={{ fontSize: 80, color: '#7f56da', mb: 2 }} />
                <StyledTypography>Teacher</StyledTypography>
                <StyledDescription>
                  Register as a teacher to manage classes, create assignments, and track student progress
                </StyledDescription>
              </Box>
            </StyledPaper>
          </Grid>
        </Grid>
        

      </Container>
    </StyledContainer>
  );
};

export default ChooseRegister;

// Styled Components
const StyledContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const StyledTitle = styled(Typography)`
  && {
    font-size: 3rem;
    color: white;
    font-weight: bold;
    padding-top: 0;
    letter-spacing: normal;
    line-height: normal;
    text-align: center;
    margin-bottom: 1rem;
  }
`;

const StyledSubtitle = styled(Typography)`
  && {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    margin-bottom: 2rem;
  }
`;

const StyledPaper = styled(Paper)`
  && {
    padding: 40px 20px;
    text-align: center;
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 15px;
    
    &:hover {
      background-color: #7f56da;
      color: white;
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(127, 86, 218, 0.3);
      
      .MuiSvgIcon-root {
        color: white !important;
      }
    }
  }
`;

const StyledTypography = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const StyledDescription = styled(Typography)`
  && {
    font-size: 0.9rem;
    line-height: 1.4;
    opacity: 0.8;
  }
`;

