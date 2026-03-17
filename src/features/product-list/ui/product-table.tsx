import { useState, useCallback } from 'react';
import { Button, Checkbox, Table, Progress, App } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  MoreOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import type { Product } from '@/entities/product';
import { useProducts } from '../model/use-products';
import { useSortStore, type SortField } from '../model/sort-store';
import { AddProductModal } from './add-product-modal';
import styles from './product-table.module.css';

const PAGE_SIZE = 20;
const RATING_LOW_THRESHOLD = 3;

function SortableHeader({
  title,
  field,
  className,
}: {
  title: string;
  field: SortField;
  className?: string;
}) {
  const { sortBy, order, setSort } = useSortStore();
  const isActive = sortBy === field;

  return (
    <button
      type="button"
      className={`${styles.columnTitle} ${styles.sortable} ${className ?? ''}`}
      onClick={() => setSort(field)}
    >
      {title}
      {isActive ? (
        order === 'asc' ? (
          <CaretUpOutlined className={styles.sortIcon} />
        ) : (
          <CaretDownOutlined className={styles.sortIcon} />
        )
      ) : (
        <span className={styles.sortPlaceholder} />
      )}
    </button>
  );
}

export function ProductTable({ searchQuery }: { searchQuery: string }) {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  const { sortBy, order } = useSortStore();
  const { data, isLoading, refetch } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: searchQuery || undefined,
    sortBy: sortBy ?? undefined,
    order: sortBy ? order : undefined,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  const displayProducts =
    page === 1 && localProducts.length > 0
      ? [...localProducts, ...products.slice(0, PAGE_SIZE - localProducts.length)]
      : products;
  const displayTotal = page === 1 ? total + localProducts.length : total;

  const [prevDeps, setPrevDeps] = useState(() => ({
    searchQuery,
    sortBy,
    order,
  }));
  if (
    prevDeps.searchQuery !== searchQuery ||
    prevDeps.sortBy !== sortBy ||
    prevDeps.order !== order
  ) {
    setPrevDeps({ searchQuery, sortBy, order });
    setPage(1);
  }

  const handleAddSuccess = useCallback(
    (product: Omit<Product, 'id' | 'category' | 'rating' | 'imageUrl'>) => {
      const newProduct: Product = {
        ...product,
        id: `local-${Date.now()}`,
        category: '',
        rating: 0,
      };
      setLocalProducts((prev) => [newProduct, ...prev]);
      message.success('Товар успешно добавлен');
    },
    [message],
  );

  const columns = [
    {
      title: <Checkbox className={styles.checkbox} />,
      dataIndex: 'select',
      key: 'select',
      width: 48,
      render: () => <Checkbox className={styles.checkbox} />,
    },
    {
      title: <SortableHeader title="Наименование" field="name" />,
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: Product) => (
        <div className={styles.productCell}>
          {record.imageUrl ? (
            <img src={record.imageUrl} alt="" className={styles.productImage} />
          ) : (
            <div className={`${styles.productImage} ${styles.productImagePlaceholder}`} />
          )}
          <div>
            <div className={styles.productName}>{record.name}</div>
            <div className={styles.productCategory}>{record.category || '—'}</div>
          </div>
        </div>
      ),
    },
    {
      title: <span className={styles.columnTitle}>Вендор</span>,
      dataIndex: 'vendor',
      key: 'vendor',
      width: 125,
      align: 'center' as const,
      render: (v: string) => <span className={styles.vendorCell}>{v}</span>,
    },
    {
      title: <span className={styles.columnTitle}>Артикул</span>,
      dataIndex: 'sku',
      key: 'sku',
      width: 160,
      align: 'center' as const,
      render: (v: string) => <span className={styles.skuCell}>{v}</span>,
    },
    {
      title: <SortableHeader title="Оценка" field="rating" className={styles.centered} />,
      dataIndex: 'rating',
      key: 'rating',
      width: 125,
      align: 'center' as const,
      render: (rating: number) => (
        <span
          className={`${styles.ratingCell} ${rating < RATING_LOW_THRESHOLD ? styles.lowRating : ''}`}
        >
          {rating ? `${rating}/5` : '—'}
        </span>
      ),
    },
    {
      title: <SortableHeader title="Цена, ₽" field="price" className={styles.centered} />,
      dataIndex: 'price',
      key: 'price',
      width: 160,
      align: 'center' as const,
      render: (price: number) => (
        <span className={styles.priceCell}>
          {price != null
            ? price.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '—'}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: () => (
        <div className={styles.productActions}>
          <Button type="primary" icon={<PlusOutlined />} className={styles.actionBtn} />
          <Button icon={<MoreOutlined />} className={styles.actionBtnSecondary} />
        </div>
      ),
    },
  ];

  const dataSource = displayProducts.map((p) => ({ ...p, key: p.id }));

  const totalPages = Math.max(1, Math.ceil(displayTotal / PAGE_SIZE));
  const startItem = displayTotal > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const endItem = displayTotal > 0 ? Math.min(page * PAGE_SIZE, displayTotal) : 0;

  return (
    <div className={styles.root}>
      {isLoading && (
        <div className={styles.loadingBar}>
          <Progress percent={100} status="active" showInfo={false} strokeColor="#242edb" />
        </div>
      )}

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Все позиции</h2>
        <div className={styles.sectionActions}>
          <Button
            icon={<ReloadOutlined />}
            className={styles.refreshBtn}
            onClick={() => refetch()}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className={styles.addBtn}
            onClick={() => setAddModalOpen(true)}
          >
            Добавить
          </Button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={isLoading}
          locale={{ emptyText: 'Нет данных' }}
          className={styles.table}
        />
      </div>

      <div className={styles.pagination}>
        <span className={styles.paginationInfo}>
          Показано {displayTotal > 0 ? `${startItem}–${endItem}` : '0'} из {displayTotal}
        </span>
        <div className={styles.paginationControls}>
          <Button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </Button>
          {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
            const p = totalPages <= 5 ? i + 1 : Math.min(page, Math.max(1, totalPages - 4)) + i;
            return (
              <Button
                key={p}
                className={p === page ? styles.pageBtnActive : styles.pageBtn}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            );
          })}
          <Button
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </Button>
        </div>
      </div>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
