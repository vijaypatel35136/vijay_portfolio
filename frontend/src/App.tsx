import { useState, useEffect } from 'react';
import Portfolio from './pages/Portfolio';
import Admin from './pages/Admin';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Listen for custom navigation events
    window.addEventListener('pushstate', handleLocationChange);
    window.addEventListener('replacestate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
      window.removeEventListener('replacestate', handleLocationChange);
    };
  }, []);

  // Simple router based on path
  if (path.startsWith('/admin')) {
    return <Admin />;
  }

  return <Portfolio />;
}

export default App;
