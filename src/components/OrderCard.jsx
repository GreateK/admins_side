import './OrderCard.css';

function OrderCard({ order, onEdit }) {
  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">Заказ #{order.id}</span>
        <span className="order-date">{order.created_at}</span>
      </div>
      <div className="order-user">
        Пользователь: {order.user_name || 'Гость'}
      </div>
      <div className="order-items">
        {order.items.map((item, idx) => (
          <div key={idx}>
            {item.product_name} — {item.quantity} шт.
          </div>
        ))}
      </div>
      <div className="order-actions">
        <button className="btn-edit" onClick={() => onEdit(order)}>
          Подробно
        </button>
      </div>
    </div>
  );
}


export default OrderCard;
