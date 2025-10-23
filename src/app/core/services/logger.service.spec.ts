import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoggerService } from '@app/core';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleLogSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleDebugSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(LoggerService);

    consoleLogSpy = spyOn(console, 'log');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
    consoleInfoSpy = spyOn(console, 'info');
    consoleDebugSpy = spyOn(console, 'debug');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('log', () => {
    it('should call console.log with message', () => {
      service.log('Test message');
      expect(consoleLogSpy).toHaveBeenCalledWith('Test message');
    });

    it('should call console.log with message and params', () => {
      service.log('Test', 'param1', 'param2');
      expect(consoleLogSpy).toHaveBeenCalledWith('Test', 'param1', 'param2');
    });

    it('should call console.log with objects', () => {
      const obj = { key: 'value' };
      service.log('Object:', obj);
      expect(consoleLogSpy).toHaveBeenCalledWith('Object:', obj);
    });
  });

  describe('warn', () => {
    it('should call console.warn with message', () => {
      service.warn('Warning message');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning message');
    });

    it('should call console.warn with message and params', () => {
      service.warn('Warning', 'details');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning', 'details');
    });
  });

  describe('error', () => {
    it('should call console.error with message', () => {
      service.error('Error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error message');
    });

    it('should call console.error with message and error object', () => {
      const error = new Error('Test error');
      service.error('Error occurred:', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error occurred:', error);
    });
  });

  describe('info', () => {
    it('should call console.info with message', () => {
      service.info('Info message');
      expect(consoleInfoSpy).toHaveBeenCalledWith('Info message');
    });

    it('should call console.info with message and params', () => {
      service.info('Info', 'details', 'more');
      expect(consoleInfoSpy).toHaveBeenCalledWith('Info', 'details', 'more');
    });
  });

  describe('debug', () => {
    it('should call console.debug with message', () => {
      service.debug('Debug message');
      expect(consoleDebugSpy).toHaveBeenCalledWith('Debug message');
    });

    it('should call console.debug with message and params', () => {
      service.debug('Debug', { data: 'value' });
      expect(consoleDebugSpy).toHaveBeenCalledWith('Debug', { data: 'value' });
    });
  });
});
