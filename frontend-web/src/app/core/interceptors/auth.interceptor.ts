import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');
  
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.token) {
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${parsedUser.token}`
          }
        });
        return next(clonedRequest);
      }
    } catch (e) {
      console.error('Erreur lors du parsing de lu token:', e);
    }
  }

  return next(req);
};
