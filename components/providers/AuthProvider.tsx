'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout, setLoading } from '@/store/slices/authSlice';
import { useSession } from '@/lib/auth-client';
import React from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  // useSession hook automatically listens to better-auth session changes
  const { data, isPending, error } = useSession();

  useEffect(() => {
    if (isPending) {
      dispatch(setLoading(true));
      return;
    }

    if (data && data.user && data.session) {
      // We found a valid session, sync with Redux
      dispatch(setCredentials({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image,
          organizationId: (data.user as any).organizationId ?? null,
          role: (data.user as any).role ?? null,
        },
        session: {
          id: data.session.id,
          userId: data.session.userId,
          expiresAt: data.session.expiresAt instanceof Date
            ? data.session.expiresAt.toISOString()
            : String(data.session.expiresAt),
        }
      }));
    } else {
      // No session or error
      dispatch(logout());
    }
    
    dispatch(setLoading(false));
  }, [data, isPending, dispatch]);

  return <>{children}</>;
}
