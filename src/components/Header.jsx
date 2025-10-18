import './Header.css';
import './btn.css';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ categories, onCategorySelect, onStatusSelect }) => {
  const location = useLocation();
  const isOrdersPage = location.pathname === '/orders';

  const orderStatuses = [
    { id: 'new', tittle: 'Новые' },
    { id: 'processing', tittle: 'В обработке' },
    { id: 'completed', tittle: 'Выполненные' },
    { id: 'cancelled', tittle: 'Отменённые' },
  ];

  const navItems = isOrdersPage ? orderStatuses : categories;

  return (
    <header className="page-header">
      <div className="page-header__container">
        {/* Логотип */}
        <a href="/" className="page-header__logo">
          <img src="/logo.png" className="page-header__logo-icon" alt="logo" />
        </a>

        {/* Навигация */}
        <nav className="page-header__nav">
          <a
            onClick={() => (isOrdersPage ? onStatusSelect(null) : onCategorySelect(null))}
            className="page-header__nav-link"
            href="#"
          >
            {isOrdersPage ? 'Все заказы' : 'Все товары'}
          </a>
          {navItems.map(item => (
            <a
              key={item.id}
              onClick={() => (isOrdersPage ? onStatusSelect(item.id) : onCategorySelect(item.id))}
              className="page-header__nav-link"
              href="#"
            >
              {item.tittle}
            </a>
          ))}
        </nav>

        {/* Кнопка справа */}
        <div className="page-header__right-block">
          {isOrdersPage ? (
            <Link to="/" className="btn page-header__btn">Товары</Link>
          ) : (
            <Link to="/orders" className="btn page-header__btn">Заказы</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
