import { Modal, Form, Input, InputNumber } from 'antd';
import type { Product } from '@/entities/product';

interface AddProductFormValues {
  name: string;
  price: number;
  vendor: string;
  sku: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (product: Omit<Product, 'id' | 'category' | 'rating' | 'imageUrl'>) => void;
}

export function AddProductModal({ open, onClose, onSuccess }: AddProductModalProps) {
  const [form] = Form.useForm<AddProductFormValues>();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSuccess({
        name: values.name,
        price: values.price,
        vendor: values.vendor,
        sku: values.sku,
      });
      form.resetFields();
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Добавить"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical" className="add-product-form">
        <Form.Item
          label="Наименование"
          name="name"
          rules={[{ required: true, message: 'Введите наименование' }]}
        >
          <Input placeholder="Наименование товара" />
        </Form.Item>
        <Form.Item label="Цена" name="price" rules={[{ required: true, message: 'Введите цену' }]}>
          <InputNumber placeholder="0" min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Вендор"
          name="vendor"
          rules={[{ required: true, message: 'Введите вендора' }]}
        >
          <Input placeholder="Название вендора" />
        </Form.Item>
        <Form.Item
          label="Артикул"
          name="sku"
          rules={[{ required: true, message: 'Введите артикул' }]}
        >
          <Input placeholder="Артикул товара" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
