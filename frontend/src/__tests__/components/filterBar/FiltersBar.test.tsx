import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FiltersBar from '../../../components/filterBar/FiltersBar';
import { VulnerabilityProvider } from '../../../context/VulnerabilityContext';
import { STATES, CRITICALITY_OPTIONS } from '../../../utils/constants';

const mockVulnerabilities = [
  {
    id: '1',
    title: 'Test Vulnerability 1',
    description: 'Test Description 1',
    cwe: 'CWE-79',
    state: STATES.OPEN,
    criticality: CRITICALITY_OPTIONS[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: []
  },
  {
    id: '2',
    title: 'Test Vulnerability 2',
    description: 'Test Description 2',
    cwe: 'CWE-89',
    state: STATES.IN_PROGRESS,
    criticality: CRITICALITY_OPTIONS[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    history: []
  },
];

const mockDispatch = vi.fn();

const mockUseVulnerabilities = vi.fn().mockReturnValue({
  filters: {
    search: '',
    status: '',
    criticality: '',
  },
  dispatch: mockDispatch,
  vulnerabilities: mockVulnerabilities,
  filteredVulnerabilities: mockVulnerabilities,
  loading: false,
  error: null
});

vi.mock('../../../context/VulnerabilityContext', () => ({
  useVulnerabilities: () => mockUseVulnerabilities(),
  VulnerabilityProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('FiltersBar', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('renders all filter inputs', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    expect(screen.getByPlaceholderText('Search vulnerabilities...')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 of 2 vulnerabilities')).toBeInTheDocument();

    const statusSelect = screen.getByLabelText('Filter by status');
    expect(statusSelect).toBeInTheDocument();

    const criticalitySelect = screen.getByLabelText('Filter by criticality');
    expect(criticalitySelect).toBeInTheDocument();
  });

  it('updates search filter on input change', async () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search vulnerabilities...');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'search', value: 'test' }
    });
  });

  it('updates status filter on select change', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const statusSelect = screen.getByLabelText('Filter by status');
    fireEvent.change(statusSelect, { target: { value: STATES.IN_PROGRESS } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'status', value: STATES.IN_PROGRESS }
    });
  });

  it('updates criticality filter on select change', () => {
    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const criticalitySelect = screen.getByLabelText('Filter by criticality');
    fireEvent.change(criticalitySelect, { target: { value: CRITICALITY_OPTIONS[1] } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_FILTER',
      payload: { key: 'criticality', value: CRITICALITY_OPTIONS[1] }
    });
  });

  it('shows "Clear Filters" button when filters are active', () => {
    mockUseVulnerabilities.mockReturnValueOnce({
      ...mockUseVulnerabilities(),
      filters: {
        search: 'test',
        status: STATES.OPEN,
        criticality: CRITICALITY_OPTIONS[0],
      },
    });

    render(
      <VulnerabilityProvider>
        <FiltersBar />
      </VulnerabilityProvider>
    );

    const clearButton = screen.getByText('Clear Filters');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR_FILTERS' });
  });
});
