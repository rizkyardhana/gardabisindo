'use client';

import dynamic from 'next/dynamic';

const DetailSignPage = dynamic(
  () => import('@/src/pages/DetailSignPage').then((mod) => mod.DetailSignPage),
  { ssr: false }
);

export default function Page() {
  return <DetailSignPage />;
}
