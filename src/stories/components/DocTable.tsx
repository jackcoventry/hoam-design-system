import { Table } from '@/components/Table';

export function DocTable({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Table>{children}</Table>;
}
