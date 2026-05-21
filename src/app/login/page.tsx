'use client';

import dynamic from 'next/dynamic';

const LoginPage = dynamic(
  () => import('@/src/pages/LoginPage').then((mod) => mod.LoginPage),
  { ssr: false }
);

export default function Page() {
  return <LoginPage />;
}
