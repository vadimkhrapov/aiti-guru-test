import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ProductTable } from '@/features/product-list';
import styles from './products-page.module.css';

const SEARCH_DEBOUNCE_MS = 400;

export function ProductsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>Товары</h1>
        <Input
          prefix={<SearchOutlined className={styles.searchIcon} />}
          placeholder="Найти"
          allowClear
          className={styles.search}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </header>

      <main className={styles.main}>
        <ProductTable searchQuery={searchQuery} />
      </main>
    </div>
  );
}
