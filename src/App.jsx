import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import './components/container.css';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    axios.get('/api/products/')
      .then(res => setProducts(res.data));
  };

  const fetchCategories = () => {
    axios.get('/api/categories/')
      .then(res => setCategories(res.data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/products/${id}`);
    fetchProducts(); 
  } catch (error) {
    console.error(error);
  }
};

  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.catigory === selectedCategoryId)
    : products;

  const groupedProducts = selectedCategoryId
    ? [{ id: selectedCategoryId, tittle: categories.find(c => c.id === selectedCategoryId)?.tittle || '', products: filteredProducts }]
    : categories.map(category => ({
        ...category,
        products: products.filter(p => p.catigory === category.id),
      }));

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProductsPage 
              categories={categories} 
            />
          } 
        />
        <Route path="/orders" element={<OrdersPage selectedStatus={selectedStatus}/>} />
      </Routes>
    </Router>
  );
}

export default App;
