import { useEffect, useState } from 'react';

const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'overview';

/**
 * Minimal hash router: '#/dsa' → 'dsa'. Hash URLs work on any static host
 * (Vercel/Netlify) without rewrite rules, and the browser back button just works.
 */
export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
