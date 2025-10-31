'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

export default function IBPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to registration page as default
    router.replace('/dashboard/ib/registration');
  }, [router]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pale-blue-500"></div>
      </div>
    </Layout>
  );
}

