import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../../utils/storage';

describe('storage utility', () => {  beforeEach(() => {
    
    const store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string): void => { store[key] = value; },
      removeItem: (key: string): void => { delete store[key]; },
      clear: (): void => { Object.keys(store).forEach(key => delete store[key]); }
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    vi.clearAllMocks();

    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should set and get a value successfully', () => {
    storage.set('testKey', 'testValue');
    expect(storage.get('testKey')).toBe('testValue');
  });

  it('should return null for non-existent key', () => {
    expect(storage.get('nonExistentKey')).toBe(null);
  });

  it('should remove a value successfully', () => {
    storage.set('testKey', 'testValue');
    storage.remove('testKey');
    expect(storage.get('testKey')).toBe(null);
  });

  it('should clear all values successfully', () => {
    storage.set('key1', 'value1');
    storage.set('key2', 'value2');
    storage.clear();
    expect(storage.get('key1')).toBe(null);
    expect(storage.get('key2')).toBe(null);
  });

  it('should handle localStorage get errors gracefully', () => {
    const error = new Error('localStorage error');
    const mockLocalStorage = {
      getItem: vi.fn(() => { throw error; })
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    expect(storage.get('testKey')).toBe(null);
    expect(console.warn).toHaveBeenCalledWith(
      'Error accessing localStorage for key "testKey":', 
      error
    );
  });

  it('should handle localStorage set errors gracefully', () => {
    const error = new Error('localStorage error');
    const mockLocalStorage = {
      setItem: vi.fn(() => { throw error; })
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    storage.set('testKey', 'testValue');
    expect(console.warn).toHaveBeenCalledWith(
      'Error setting localStorage for key "testKey":', 
      error
    );
  });

  it('should handle localStorage remove errors gracefully', () => {
    const error = new Error('localStorage error');
    const mockLocalStorage = {
      removeItem: vi.fn(() => { throw error; })
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    storage.remove('testKey');
    expect(console.warn).toHaveBeenCalledWith(
      'Error removing localStorage for key "testKey":', 
      error
    );
  });

  it('should handle localStorage clear errors gracefully', () => {
    const error = new Error('localStorage error');
    const mockLocalStorage = {
      clear: vi.fn(() => { throw error; })
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    storage.clear();
    expect(console.warn).toHaveBeenCalledWith(
      'Error clearing localStorage:', 
      error
    );
  });
});
