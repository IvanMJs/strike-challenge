import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { fetch } from 'cross-fetch';

// Mock fetch globally
global.fetch = fetch;

// Mock localStorage
const storedItems: { [key: string]: string } = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => storedItems[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storedItems[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete storedItems[key];
  }),
  clear: vi.fn(() => {
    Object.keys(storedItems).forEach(key => delete storedItems[key]);
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(storedItems)[index] || null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
