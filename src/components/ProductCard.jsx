import { Image, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './ProductCard.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const actions = [
    <EditOutlined key="edit" onClick={() => onEdit(product)} />,
    <DeleteOutlined key="delete" onClick={() => onDelete(product.id)} />,
  ];

  // Базовое изображение-заглушка
  let imageUrl = '/no-image.png';

  // Если у товара есть изображения
  if (product.images?.length > 0) {
    const rawUrl = product.images[0].image_url;

    if (rawUrl) {
      if (rawUrl.startsWith('/media')) {
        imageUrl = `${BASE_URL}${rawUrl}`;
      } else if (rawUrl.startsWith('http')) {
        imageUrl = rawUrl;
      } else {
        imageUrl = `${BASE_URL}/media/${rawUrl}`;
      }
    }
  }

  return (
    <Card className="product-card" actions={actions}>
      <div className="product-card__content">
        <Image
          className="product-card__image"
          src={imageUrl}
          alt={product.name}
          preview={false}
          onError={(e) => {
            e.target.src = '/no-image.png';
          }}
        />
        <div className="product-card__info">
          <h4 className="product-card__title">{product.name}</h4>
          <p className="product-card__desc">{product.description}</p>
          <p className="product-card__price">Цена: {product.price} ₽</p>
          {!product.available && (
            <p className="product-card__status">Нет в наличии</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
