import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth';
import { LoginPage } from '@/pages/login';
import { ProductsPage } from '@/pages/products';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <div style={{ padding: 24, textAlign: 'center' }}>
                <h1>Регистрация</h1>
                <p>Страница в разработке</p>
              </div>
            </GuestRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
