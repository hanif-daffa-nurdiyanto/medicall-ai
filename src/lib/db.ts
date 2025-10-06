import type { Post } from './types';

export const posts = [
  { id: 1, title: 'Postingan Pertama' },
  { id: 2, title: 'Postingan Kedua' },
  { id: 3, title: 'Postingan Ketiga' },
];

export const db = {
  select: () => ({
    from: (table: Post[]): Promise<Post[]> => {
      // Simulasikan database query async
      return Promise.resolve(table);
    },
  }),
};