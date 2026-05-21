'use client';

import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('@/src/pages/LandingPage').then((mod) => mod.LandingPage),
  { ssr: false }
);

export default function Page() {
  return <LandingPage />;
}
