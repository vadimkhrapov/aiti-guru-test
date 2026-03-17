import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Button, Checkbox, Divider, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth';
import { login } from '@/features/auth/api/login';
import type { User } from '@/entities/user/model/types';
import styles from './login-form.module.css';

interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const { message } = App.useApp();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();

  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    try {
      const response = await login({
        username: values.username,
        password: values.password,
      });
      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        image: response.image,
      };
      setAuth(user, response.accessToken, values.rememberMe);
      navigate('/', { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка авторизации';
      message.error(errorMessage);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ rememberMe: false }}
      className={styles.form}
    >
      <Form.Item
        label="Логин"
        name="username"
        required={false}
        rules={[{ required: true, message: 'Введите логин' }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#c9c9c9' }} />}
          placeholder="test"
          allowClear
        />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        required={false}
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#c9c9c9' }} />}
          placeholder="••••••••"
        />
      </Form.Item>

      <Form.Item name="rememberMe" valuePropName="checked" className={styles.checkbox}>
        <Checkbox>Запомнить данные</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block className={styles.button}>
          Войти
        </Button>
      </Form.Item>

      <Divider plain className={styles.divider}>
        или
      </Divider>
      <div className={styles.footer}>
        Нет аккаунта?{' '}
        <Link to="/register" className={styles.footerLink}>
          Создать
        </Link>
      </div>
    </Form>
  );
}
