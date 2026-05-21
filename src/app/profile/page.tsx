'use client';

import dynamic from 'next/dynamic';

const ProfilePage = dynamic(
  () => import('@/src/pages/ProfilePage').then((mod) => mod.ProfilePage),
  { ssr: false }
);

export default function Page() {
  return <ProfilePage />;
}
