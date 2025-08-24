// src/pages/Dashboard/HomePage.js
import React from 'react';
import { Box, Container } from '@mui/material';
import TopBar from '../../components/Layout/TopBar';
import BottomNavBar from '../../components/Layout/BottomNavBar';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabHome from './TabHome';
import TabDevices from './TabDevices';
import TabReports from './TabReports';
import TabSettings from './TabSettings';

export default function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', pb: 12 }}>
      <TopBar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
        <Routes>
          <Route index element={<TabHome />} />
          <Route path="devices" element={<TabDevices />} />
          <Route path="logs" element={<TabReports />} />
          <Route path="settings" element={<TabSettings />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Container>
      <BottomNavBar />
    </Box>
  );
}
