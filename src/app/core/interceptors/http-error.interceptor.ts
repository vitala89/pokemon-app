import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('Client side error:', error.error.message);
      } else {
        // Server-side error
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
        console.error(`Server side error: Status ${error.status}`, error.message);

        // Handle specific HTTP errors
        switch (error.status) {
          case 404:
            errorMessage = 'Resource not found. The Pokémon you are looking for does not exist.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          case 0:
            errorMessage = 'No internet connection. Please check your network.';
            break;
        }
      }

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        originalError: error,
      }));
    }),
  );
};
