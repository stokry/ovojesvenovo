import { writable } from 'svelte/store';

export const currentRoute = writable({
  path: window.location.pathname,
  params: {}
});

export const navigate = (path) => {
  window.history.pushState({}, '', path);
  currentRoute.set({ path, params: {} });
};

window.addEventListener('popstate', () => {
  currentRoute.set({
    path: window.location.pathname,
    params: {}
  });
});

// Parse URL parameters
function parseParams(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return {
      category: parts[0],
      postId: parts[1]
    };
  }
  return {};
}

// Update currentRoute when the page loads
currentRoute.set({
  path: window.location.pathname,
  params: parseParams(window.location.pathname)
});

