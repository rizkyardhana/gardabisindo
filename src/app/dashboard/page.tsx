'use client';

import dynamic from 'next/dynamic';

const DashboardPage = dynamic(
  () => import('@/src/pages/DashboardPage').then((mod) => mod.DashboardPage),
  { ssr: false }
);

export default function Page() {
  return <DashboardPage />;
}
