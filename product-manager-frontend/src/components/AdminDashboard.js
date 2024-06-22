import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Box, Typography } from '@mui/material';
import ProductList from './ProductList';
import UserList from './UserList';

function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Admin Dashboard</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button component={Link} to="/admin/products" variant="contained">Manage Products</Button>
        <Button component={Link} to="/admin/users" variant="contained">Manage Users</Button>
        <Button onClick={logout} variant="outlined">Logout</Button>
      </Box>
      <Routes>
        <Route path="products" element={<ProductList />} />
        <Route path="users" element={<UserList />} />
      </Routes>
    </Box>
  );
}

export default AdminDashboard;