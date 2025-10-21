import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.log(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams);
  }

  info(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.info(message, ...optionalParams);
    }
  }

  debug(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.debug(message, ...optionalParams);
    }
  }
}
