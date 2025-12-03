import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { authAtom } from '@/shared/store/atoms';
import { pb } from '@/shared/config/pocketbase';

export function PersistLogin({ children }) {
  const [, setAuth] = useAtom(authAtom);

  useEffect(() => {
    // Restore auth state from PocketBase authStore on mount
    if (pb.authStore.isValid && pb.authStore.record) {
      setAuth(pb.authStore.record);
    }
  }, [setAuth]);

  return children;
}
