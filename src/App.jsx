import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import './components/container.css';

// Берём адрес API из .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Настраиваем базовый URL для всех запросов axios
axios.defaults.baseURL = `${BASE_URL}`;

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    axios.get('/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ошибка при загрузке товаров:', err));
  };

  const fetchCategories = () => {
    axios.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Ошибка при загрузке категорий:', err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts(); 
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
    }
  };

  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.catigory === selectedCategoryId)
    : products;

  const groupedProducts = selectedCategoryId
    ? [{
        id: selectedCategoryId,
        tittle: categories.find(c => c.id === selectedCategoryId)?.tittle || '',
        products: filteredProducts
      }]
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
              products={products}
              groupedProducts={groupedProducts}
              onDelete={handleDelete}
              onReload={fetchProducts}
            />
          } 
        />
        <Route 
          path="/orders" 
          element={<OrdersPage selectedStatus={selectedStatus}/>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
