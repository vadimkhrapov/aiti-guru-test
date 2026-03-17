import { Card, Layout, Typography } from 'antd';
import { LoginForm } from '@/features/auth';
import logoUrl from '@/assets/logo.svg';
import styles from './login-page.module.css';

const { Title } = Typography;

export function LoginPage() {
  return (
    <Layout className={styles.root}>
      <Layout.Content>
        <Card className={styles.card}>
          <div className={styles.content}>
            <div className={styles.logoBlock}>
              <img src={logoUrl} alt="" className={styles.logo} aria-hidden />
            </div>
            <div className={styles.header}>
              <Title level={2} className={styles.title}>
                Добро пожаловать!
              </Title>
              <span className={styles.subtitle}>Пожалуйста, авторизируйтесь</span>
            </div>
            <div className={styles.form}>
              <LoginForm />
            </div>
          </div>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
