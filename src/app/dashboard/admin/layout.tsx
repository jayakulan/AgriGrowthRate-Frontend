import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | AgriGrowthRate',
  description: 'Admin management portal for AgriGrowthRate platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
