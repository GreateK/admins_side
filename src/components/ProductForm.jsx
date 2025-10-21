import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Upload,
  Space,
  Spin,
  Alert,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/reset.css';

const { TextArea } = Input;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ProductForm = ({ product, categories, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    form.resetFields();
    setFormError(null);

    if (product) {
      const { images, ...safeProduct } = product;
      form.setFieldsValue(safeProduct);

      if (images?.length > 0) {
        setFileList(
          images.map((img) => ({
            uid: String(img.id),
            name: `image_${img.id}`,
            status: 'done',
            url: `${BASE_URL}${img.image_url}`,
            response: { id: img.id },
          }))
        );
      }
    } else {
      setFileList([]);
    }
  }, [product, form]);

  const getChangedFields = (values, product) => {
    if (!product) return values;
    return Object.fromEntries(
      Object.entries(values).filter(([key, val]) => product[key] !== val)
    );
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setFormError(null);

      let payload = product ? getChangedFields(values, product) : values;

      if (product && Object.keys(payload).length === 0) {
        message.info('Нет изменений для сохранения');
        setLoading(false);
        return;
      }

      let savedProduct;

      if (product) {
        const res = await axios.patch(`${BASE_URL}/products/${product.id}`, payload);
        savedProduct = res.data;
        message.success('Товар успешно обновлён');
      } else {
        const res = await axios.post(`${BASE_URL}/products/`, payload);
        savedProduct = res.data;
        message.success('Товар успешно создан');
      }

      // 🖼️ Загрузка новых фото
      for (const file of fileList) {
        if (file.originFileObj) {
          const formData = new FormData();
          formData.append('file', file.originFileObj);

          await axios.post(
            `${BASE_URL}/products/${savedProduct.id}/upload-image`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }
      }

      form.resetFields();
      setFileList([]);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          setFormError(error.response.data.detail);
        } else {
          setFormError('Ошибка при сохранении товара');
        }
      } else {
        setFormError('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (file) => {
    try {
      if (file.response?.id) {
        await axios.delete(`${BASE_URL}/products/images/${file.response.id}`);
        message.success('Изображение удалено');
      }
      return true;
    } catch (error) {
      console.error(error);
      message.error('Ошибка при удалении изображения');
      return false;
    }
  };

  return (
    <Spin spinning={loading}>
      <div
        style={{
          maxHeight: '75vh',
          overflowY: 'auto',
          paddingRight: '8px',
        }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ price: 0, amount: 0, description: '' }}
          size="small"
        >
          {formError && (
            <Form.Item>
              <Alert message={formError} type="error" showIcon />
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название товара' }]}
          >
            <Input size="small" />
          </Form.Item>

          <Form.Item
            name="catigory"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select
              size="small"
              options={categories.map((c) => ({
                value: c.id,
                label: c.tittle,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} size="small" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Количество"
            rules={[{ required: true, message: 'Введите количество' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} size="small" />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <TextArea
              autoSize={{ minRows: 3, maxRows: 10 }}
              style={{ width: '100%' }}
              size="small"
            />
          </Form.Item>

          <Form.Item label="Изображения">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={handleRemove}
              multiple
              style={{ maxWidth: 280 }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 4, fontSize: 12 }}>Загрузить</div>
              </div>
            </Upload>
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={() => form.resetFields()} size="small">
              Очистить
            </Button>
            <Button type="primary" htmlType="submit" size="small">
              {product ? 'Сохранить' : 'Добавить'}
            </Button>
          </Space>
        </Form>
      </div>
    </Spin>
  );
};

export default ProductForm;
