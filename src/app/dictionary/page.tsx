'use client';

import dynamic from 'next/dynamic';

const DictionaryPage = dynamic(
  () => import('@/src/pages/DictionaryPage').then((mod) => mod.DictionaryPage),
  { ssr: false }
);

export default function Page() {
  return <DictionaryPage />;
}
