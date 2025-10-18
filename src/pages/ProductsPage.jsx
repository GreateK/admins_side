import axios from 'axios';
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import { useEffect, useState } from 'react';
import '../components/container.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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

  const handleEdit = (product) => {
    setEditProduct(product);
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
    <div className="main">
      <Header
        categories={categories}
        onCategorySelect={setSelectedCategoryId}
      />
      <div className="container">
        <div className="container__list">
          {groupedProducts.map(group => (
            <div key={group.id}>
              {!selectedCategoryId && <h2>{group.tittle}</h2>}
              {group.products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="container__form">
          <ProductForm
            product={editProduct}
            onSuccess={() => {
              fetchProducts();
              setEditProduct(null);
            }}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
