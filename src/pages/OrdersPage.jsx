import axios from 'axios';
import Header from "../components/Header";
import OrderCard from "../components/OrderCard";
import OrderForm from "../components/OrderForm";
import { useEffect, useState } from 'react';
import '../components/container.css';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  const fetchOrders = () => {
    axios.get('/api/orders/')
      .then(res => {
        setOrders(res.data);

        // Формируем список уникальных статусов + пункт "Все заказы"
        const uniqueStatuses = [
          { id: 'all', title: 'Все заказы' },
          ...[...new Set(res.data.map(o => o.status))].map((status, idx) => ({
            id: idx,
            title: status
          }))
        ];
        setStatuses(uniqueStatuses);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    setEditOrder(order);
  };

  const handleCategorySelect = (statusTitle) => {
    if (statusTitle === 'Все заказы') {
      setSelectedStatus(null); // сброс фильтра
    } else {
      setSelectedStatus(statusTitle);
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter(o => o.status === selectedStatus)
    : orders;

  const groupedOrders = selectedStatus
    ? [{ id: selectedStatus, title: selectedStatus, orders: filteredOrders }]
    : statuses
        .filter(s => s.title !== 'Все заказы')
        .map(statusObj => ({
          ...statusObj,
          orders: orders.filter(o => o.status === statusObj.title),
        }));

  return (
    <div className="main">
      <Header
        categories={statuses}
        onCategorySelect={handleCategorySelect}
      />
      <div className="container">
        <div className="container__list">
          {groupedOrders.map(group => (
            <div key={group.id}>
              {!selectedStatus && <h3>{group.title}</h3>}
              {group.orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="container__form">
          <OrderForm order={editOrder} onOrderUpdated={fetchOrders} />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
