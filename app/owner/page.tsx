'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const OwnerPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Owner Dashboard</h1>
          
          <div className="bg-card rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
            <p className="text-muted-foreground mb-4">
              You are successfully authenticated as the owner.
            </p>
            
            {session?.user && (
              <div className="mb-6">
                <p><strong>Email:</strong> {session.user.email}</p>
                {session.user.name && <p><strong>Name:</strong> {session.user.name}</p>}
              </div>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors hover:cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Blog Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage your blog posts, create new content, and moderate comments.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors hover:cursor-pointer">
                Manage Blog
              </button>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Portfolio Settings</h3>
              <p className="text-muted-foreground mb-4">
                Update your portfolio content, projects, and personal information.
              </p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors hover:cursor-pointer">
                Edit Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPage;
