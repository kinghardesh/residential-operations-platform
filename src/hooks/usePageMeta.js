import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export function usePageMeta(meta) {
  const { setPageMeta } = useOutletContext() || {};
  useEffect(() => {
    setPageMeta?.(meta);
    // Intentionally run once on mount per route view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
