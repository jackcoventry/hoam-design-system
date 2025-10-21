import Table from '@/components/Table/Table';
import React from 'react';

function DocTable({ children }: { children: React.ReactNode }) {
  return <Table>{children}</Table>;
}

export default DocTable;
