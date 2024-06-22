import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button, Box, Typography, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function UserDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [researchData, setResearchData] = useState(null);

  useEffect(() => {
    fetchUserProducts();
    fetchAllProducts();
  }, []);

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users/me/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching user products', error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching all products', error);
    }
  };

  const handleResearch = async (productId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/products/${productId}/research/`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResearchData(response.data);
      setOpen(true);
    } catch (error) {
      console.error('Error researching product', error);
    }
  };

  const handleEdit = async (productId, newName) => {
    try {
      await axios.post('http://localhost:8000/api/users/edit_product/',
        { product_id: productId, new_name: newName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchUserProducts();
    } catch (error) {
      console.error('Error editing product', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.post('http://localhost:8000/api/users/remove_product/',
        { product_id: productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchUserProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleAddProduct = async (productId) => {
    try {
      await axios.post('http://localhost:8000/api/users/add_product/',
        { product_id: productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchUserProducts();
    } catch (error) {
      console.error('Error adding product', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>User Dashboard</Typography>
      <Button onClick={logout} variant="outlined" sx={{ mb: 2 }}>Logout</Button>

      <Typography variant="h5" sx={{ mb: 2 }}>Your Products</Typography>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ListItemText primary={product.name} />
            <Button onClick={() => handleResearch(product.id)}>Research</Button>
            <Button onClick={() => handleEdit(product.id, prompt('Enter new name'))}>Edit</Button>
            <Button onClick={() => handleDelete(product.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>All Available Products</Typography>
      <List>
        {allProducts.map((product) => (
          <ListItem key={product.id}>
            <ListItemText primary={product.name} />
            <Button onClick={() => handleAddProduct(product.id)}>Add to My Products</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Research Results</DialogTitle>
        <DialogContent>
          {researchData && (
            <Box>
              <Typography variant="h6">{researchData.product_name}</Typography>
              {researchData.features.map((feature, index) => (
                <Box key={index}>
                  <Typography>{feature}</Typography>
                  {researchData.brands.map((brand, brandIndex) => (
                    <Typography key={brandIndex}>
                      {brand}: {researchData.ratings[brandIndex][index]}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserDashboard;