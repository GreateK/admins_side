import { useEffect } from 'react';
import { Form, Input, Button, message, Select, Popconfirm } from 'antd';
import axios from 'axios';
import 'antd/dist/reset.css';
import './OrderForm.css';

const { Option } = Select;

const OrderForm = ({ order, onOrderUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (order) {
      form.setFieldsValue({
        user: order.user_id ? `Пользователь ID: ${order.user_id}` : 'Гость',
        created_at: new Date(order.created_at).toLocaleString(),
        status: order.status,
      });
    }
  }, [order, form]);

  const onFinish = async (values) => {
    try {
      const payload = {
        status: values.status,
        order_items: order.items.map((item) => ({
          product_name: item.product_name,
          quantity: item.quantity,
        })),
      };

      await axios.put(`/api/orders/${order.id}`, payload);

      message.success('Заказ успешно обновлён');
      if (onOrderUpdated) {
        onOrderUpdated(); // 🔄 обновляем список заказов
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при обновлении заказа');
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/orders/${order.id}`);
      message.success('Заказ удалён');
      if (onOrderUpdated) {
        onOrderUpdated(); // 🔄 обновляем список заказов
      }
    } catch (err) {
      console.error(err);
      message.error('Ошибка при удалении заказа');
    }
  };

  if (!order) {
    return (
      <p className="order-form__placeholder">
        Выберите заказ для редактирования
      </p>
    );
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        user: '',
        created_at: '',
        status: 'new',
      }}
      className="order-form"
    >
      <Form.Item name="user" label="Пользователь">
        <Input disabled />
      </Form.Item>

      <Form.Item name="created_at" label="Дата заказа">
        <Input disabled />
      </Form.Item>

      <Form.Item name="status" label="Статус">
        <Select>
          <Option value="new">Новый</Option>
          <Option value="processing">В обработке</Option>
          <Option value="completed">Выполнен</Option>
          <Option value="cancelled">Отменён</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Товары">
        <ul className="order-form__items">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product_name} — {item.quantity} шт.
            </li>
          ))}
        </ul>
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Сохранить изменения
      </Button>

      <Popconfirm
        title="Удалить заказ?"
        description="Вы уверены, что хотите удалить этот заказ?"
        onConfirm={onDelete}
        okText="Да"
        cancelText="Нет"
      >
        <Button danger block style={{ marginTop: '8px' }}>
          Удалить заказ
        </Button>
      </Popconfirm>
    </Form>
  );
};

export default OrderForm;
