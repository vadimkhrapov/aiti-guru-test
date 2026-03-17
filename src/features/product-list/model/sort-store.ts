import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SortField = 'price' | 'rating' | 'name';
export type SortOrder = 'asc' | 'desc';

const VALID_SORT_FIELDS: SortField[] = ['price', 'rating', 'name'];

interface SortState {
  sortBy: SortField | null;
  order: SortOrder;
  setSort: (field: SortField) => void;
}

export const useSortStore = create<SortState>()(
  persist(
    (set) => ({
      sortBy: null,
      order: 'asc',
      setSort: (field: SortField) =>
        set((state) => {
          if (state.sortBy === field) {
            return { order: state.order === 'asc' ? 'desc' : 'asc' };
          }
          return { sortBy: field, order: 'asc' };
        }),
    }),
    {
      name: 'products-sort',
      partialize: (state) => ({
        sortBy: state.sortBy && VALID_SORT_FIELDS.includes(state.sortBy)
          ? state.sortBy
          : null,
        order: state.order,
      }),
    },
  ),
);
