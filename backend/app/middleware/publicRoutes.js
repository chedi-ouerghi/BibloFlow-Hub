const publicRoutes = [
  { path: '/api/livres', method: 'GET' },
  { path: '/api/livres/:id', method: 'GET' },
  { path: '/api/categories', method: 'GET' },
  { path: '/api/auteurs', method: 'GET' },
  { path: '/api/auth/signin', method: 'POST' },
  { path: '/api/auth/signup', method: 'POST' }
];

const isPublicRoute = (req) => {
  const reqPath = req.path;
  const reqMethod = req.method;
  
  return publicRoutes.some(route => {
    const routeRegex = new RegExp('^' + route.path.replace(/:\w+/g, '[^/]+') + '$');
    return routeRegex.test(reqPath) && route.method === reqMethod;
  });
};

module.exports = { isPublicRoute, publicRoutes };